import pandas as pd
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
from cleverminer_tasks.api.dataset.service import (
    create_derived_dataset,
    create_dataset_profile,
)
from cleverminer_tasks.api.dataset.utils.clmTargetCandidates import build_clm_candidates
from cleverminer_tasks.api.dataset.utils.datasetColumns import create_dataset_columns
from cleverminer_tasks.api.dataset.utils.datasetStats import build_stats
from cleverminer_tasks.api.views import IsOwnerOrAdmin
from cleverminer_tasks.execution.utils.datasetLoader import load_dataset
from cleverminer_tasks.models import Dataset, DatasetProfile


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

    def get_queryset(self):
        qs = Dataset.objects.all()
        user = self.request.user
        project_id = self.request.query_params.get("project")

        if user.is_authenticated and user.is_staff:
            return qs
        if user.is_authenticated:
            if project_id:
                return qs.filter(project_id=project_id)
            return qs.filter(owner=user)
        return qs.none()

    def perform_create(self, serializer):
        dataset = serializer.save(owner=self.request.user)

        dataset_profile = DatasetProfile.objects.create(dataset=dataset)
        create_dataset_profile(dataset=dataset, dataset_profile=dataset_profile)

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
                "total_columns": total_columns,
                "usable_as_is": usable_as_is,
                "not_usable_as_is": not_usable_as_is,
                "row_count": stats_data.get("row_count", 0),
            }
        )
