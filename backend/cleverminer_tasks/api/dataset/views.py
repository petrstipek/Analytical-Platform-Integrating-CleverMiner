import csv

import pandas as pd
from django.http import HttpResponse
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from cleverminer_tasks.api.dataset.serializers import (
    DatasetSerializer,
    CreateDerivedDatasetSerializer,
)
from cleverminer_tasks.execution.datasets.profile.buildDatasetProfile import (
    build_dataset_profile,
)
from cleverminer_tasks.execution.datasets.profile.clmTargetCandidates import (
    build_clm_candidates,
)
from cleverminer_tasks.execution.datasets.profile.datasetColumns import (
    create_dataset_columns,
)
from cleverminer_tasks.execution.datasets.profile.datasetStats import build_stats
from cleverminer_tasks.api.views import IsOwnerOrAdmin
from cleverminer_tasks.execution.datasets.transformations.service import (
    create_derived_dataset,
)
from cleverminer_tasks.execution.utils.datasetLoader import load_dataset
from cleverminer_tasks.models import Dataset
from cleverminer_tasks.execution.tasks import convert_csv_to_parquet


class IsDatasetOwnerOrProjectMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.owner == request.user:
            return True
        return obj.projects.filter(memberships__user=request.user).exists()


class DatasetViewSet(viewsets.ModelViewSet):
    serializer_class = DatasetSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="project",
                type=OpenApiTypes.INT,
                location="query",
                required=False,
                description="Filter tasks by project id",
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_permissions(self):
        if self.action in (
            "retrieve",
            "preview",
            "columns",
            "stats",
            "clm_candidates",
            "dataset_main_stats",
            "dataset_stats_overview",
            "get_dataset_profile",
            "transformation",
            "children_transformations",
        ):
            return [permissions.IsAuthenticated(), IsDatasetOwnerOrProjectMember()]

        return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]

    def get_queryset(self):
        qs = Dataset.objects.prefetch_related("tasks")
        user = self.request.user
        project_id = self.request.query_params.get("project")

        if user.is_authenticated and user.is_staff:
            return qs
        if user.is_authenticated:
            if project_id:
                return qs.filter(
                    projects__id=project_id, projects__memberships__user=user
                ).distinct()

            from django.db.models import Q

            return qs.filter(
                Q(owner=user) | Q(projects__memberships__user=user)
            ).distinct()

        return qs.none()

    def perform_create(self, serializer):
        dataset = serializer.save(owner=self.request.user)

        convert_csv_to_parquet.delay(dataset.id)

    def perform_destroy(self, instance):
        if instance.tasks.exists():
            from rest_framework.exceptions import ValidationError

            raise ValidationError("Cannot delete a dataset that is used in tasks.")

        if instance.file:
            instance.file.delete(save=False)
        instance.delete()

    @action(detail=True, methods=["get"])
    def columns(self, request, pk=None):
        dataset = self.get_object()

        dataset_profile = dataset.profile

        if not dataset_profile.dataset_columns:
            dataset_profile_columns = create_dataset_columns(dataset)
            dataset_profile.dataset_columns = dataset_profile_columns
            dataset_profile.save()
        else:
            dataset_profile_columns = dataset.profile.dataset_columns

        return Response(
            {
                "dataset_id": dataset.id,
                "columns": dataset_profile_columns,
            }
        )

    @action(detail=True, methods=["get"])
    def preview(self, request, pk=None):
        dataset = self.get_object()
        rows = int(request.query_params.get("rows", 50))
        rows = max(1, min(rows, 500))
        df = load_dataset(dataset, nrows=rows)
        df.replace([float("inf"), float("-inf"), float("nan")], None, inplace=True)
        preview_records = df.where(pd.notnull(df), None).to_dict(orient="records")

        return Response(
            {
                "dataset_id": dataset.id,
                "rows": len(preview_records),
                "columns": [str(c) for c in df.columns],
                "data": preview_records,
            }
        )

    @action(detail=True, methods=["get"])
    def stats(self, request, pk=None):
        dataset = self.get_object()

        if not dataset.profile.dataset_stats:
            dataset_stats = build_stats(dataset)
            dataset.profile.dataset_stats = dataset_stats
            dataset.profile.save()
        else:
            dataset_stats = dataset.profile.dataset_stats
        return Response(
            {
                **dataset_stats,
            }
        )

    @action(detail=True, methods=["get"], url_path="clm-candidates")
    def clm_candidates(self, request, pk=None):
        dataset = self.get_object()

        if not dataset.profile.dataset_clm_guidance:
            dataset_clm_guidance = build_clm_candidates(load_dataset(dataset))
            dataset.profile.dataset_clm_guidance = dataset_clm_guidance
            dataset.profile.save()
        else:
            dataset_clm_guidance = dataset.profile.dataset_clm_guidance
        return Response(
            {
                "dataset_id": dataset.id,
                **dataset_clm_guidance,
            }
        )

    @extend_schema(
        operation_id="upload_dataset",
        request={"multipart/form-data": DatasetSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        request=CreateDerivedDatasetSerializer,
        responses={202: OpenApiTypes.OBJECT},
    )
    @action(detail=True, methods=["post"], url_path="create-derived")
    def create_derived(self, request, pk=None):
        input_dataset = self.get_object()

        ser = CreateDerivedDatasetSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        created = create_derived_dataset(
            input_dataset=input_dataset,
            user=request.user,
            name=ser.validated_data["name"],
            transform_spec=ser.validated_data["transform_spec"],
            output_format=ser.validated_data["output_format"],
        )

        return Response(
            {
                "dataset_id": created.dataset.id,
                "transformation_id": created.transformation.id,
                "status": created.transformation.status,
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @action(detail=True, methods=["get"], url_path="transformation")
    def transformation(self, request, pk=None):
        ds = self.get_object()
        tr = getattr(ds, "transformation", None)
        if not tr:
            return Response(
                {"detail": "No transformation for this dataset."}, status=404
            )

        return Response(
            {
                "transformation_id": tr.id,
                "status": tr.status,
                "error_log": tr.error_log,
                "created_at": tr.created_at,
                "started_at": tr.started_at,
                "finished_at": tr.finished_at,
            }
        )

    @action(detail=True, methods=["get"], url_path="dataset-main-stats")
    def dataset_main_stats(self, request, pk=None):
        dataset = self.get_object()

        return Response(build_stats(dataset))

    @action(detail=True, methods=["get"], url_path="dataset-stats-overview")
    def dataset_stats_overview(self, request, pk=None):
        dataset = self.get_object()
        dataset_profile = dataset.profile

        stats_data = dataset_profile.dataset_stats or {}
        dataset_columns = stats_data.get("columns", [])

        total_columns = len(dataset_columns)
        usable_as_is = 0

        for col in dataset_columns:
            guidance = col.get("clm_guidance", {})

            if guidance.get("clm_usable_as_is") is True:
                usable_as_is += 1

        not_usable_as_is = total_columns - usable_as_is

        return Response(
            {
                "dataset_id": dataset.id,
                "dataset_name": dataset.name,
                "total_columns": total_columns,
                "usable_as_is": usable_as_is,
                "not_usable_as_is": not_usable_as_is,
                "row_count": stats_data.get("row_count", 0),
            }
        )

    @action(detail=True, methods=["get"], url_path="dataset-profile")
    def get_dataset_profile(self, request, pk=None):
        dataset = self.get_object()

        dataset_profile = dataset.profile

        if not dataset_profile.dataset_eda_profile:
            dataset_profile_eda = build_dataset_profile(load_dataset(dataset))
            dataset_profile.dataset_eda_profile = dataset_profile_eda
            dataset_profile.save()
        else:
            dataset_profile_eda = dataset.profile.dataset_eda_profile

        return Response({**dataset_profile_eda})

    @action(detail=False, methods=["GET"], url_path="export")
    def export(self, request):
        datasets = self.get_queryset()

        response = HttpResponse(content_type="text/csv; charset=utf-8")
        response["Content-Disposition"] = 'attachment; filename="datasets.csv"'

        writer = csv.writer(response)
        writer.writerow(
            ["id", "name", "source", "delimiter", "created_at", "parent", "is_ready"]
        )

        for dataset in datasets.iterator():
            writer.writerow(
                [
                    dataset.id,
                    dataset.name,
                    dataset.source,
                    dataset.delimiter,
                    dataset.created_at,
                    dataset.parent,
                    dataset.is_ready,
                ]
            )

        return response

    @action(detail=True, methods=["get"], url_path="children-transformations")
    def children_transformations(self, request, pk=None):
        dataset = self.get_object()

        children = Dataset.objects.filter(parent=dataset).select_related(
            "transformation"
        )

        data = []

        for child in children:
            tr = getattr(child, "transformation", None)
            data.append(
                {
                    "dataset_id": child.id,
                    "dataset_name": child.name,
                    "created_at": child.created_at,
                    "is_ready": child.is_ready,
                    "file_format": child.file_format,
                    "transformation": {
                        "transformation_id": tr.id,
                        "status": tr.status,
                        "transform_spec": tr.transform_spec,
                        "created_at": tr.created_at,
                        "started_at": tr.started_at,
                        "finished_at": tr.finished_at,
                        "error_log": tr.error_log,
                    }
                    if tr
                    else None,
                }
            )

        return Response({"dataset_id": dataset.id, "children": data})

    @action(
        detail=True, methods=["get"], url_path="columns/(?P<column_name>[^/.]+)/values"
    )
    def column_values(self, request, pk=None, column_name=None):
        dataset = self.get_object()

        df = load_dataset(dataset, columns=[column_name])

        if column_name not in df.columns:
            return Response(
                {"detail": f"Column '{column_name}' not found in dataset."},
                status=status.HTTP_404_NOT_FOUND,
            )

        values = df[column_name].dropna().unique().tolist()
        values = [str(v) for v in values]
        values.sort()

        return Response(
            {
                "dataset_id": dataset.id,
                "column": column_name,
                "values": values,
            }
        )
