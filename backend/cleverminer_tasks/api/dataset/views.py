import math
import pandas as pd
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter
from pydantic import ValidationError
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from cleverminer_tasks.api.dataset.serializers import (
    DatasetSerializer,
    CreateDerivedDatasetSerializer,
)
from cleverminer_tasks.api.dataset.service import create_derived_dataset
from cleverminer_tasks.api.dataset.utils.clmDataGuidance import clm_column_data_guidance
from cleverminer_tasks.api.dataset.utils.clmTargetCandidates import build_clm_candidates
from cleverminer_tasks.api.views import IsOwnerOrAdmin
from cleverminer_tasks.execution.utils.datasetLoader import load_dataset
from cleverminer_tasks.models import Dataset


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
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["get"])
    def columns(self, request, pk=None):
        dataset = self.get_object()

        df = load_dataset(dataset, nrows=50)

        cols = []
        for c in df.columns:
            cols.append(
                {
                    "name": str(c),
                    "dtype": str(df[c].dtype),
                    "null_sample": int(df[c].isnull().sum()),
                    "non_null_sample": int(df[c].notna().sum()),
                }
            )

        return Response(
            {
                "dataset_id": dataset.id,
                "columns": cols,
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

        df = load_dataset(dataset, nrows=None)

        row_count = int(len(df))
        col_stats = []
        for c in df.columns:
            series = df[c]
            non_null = int(series.notna().sum())
            nulls = int(series.isna().sum())
            nunique = int(series.nunique(dropna=True))
            guidance = clm_column_data_guidance(
                series, str(c), max_categories_default=100
            )

            col_stats.append(
                {
                    "name": str(c),
                    "dtype": str(series.dtype),
                    "non_null": non_null,
                    "nulls": nulls,
                    "nunique": nunique,
                    "clm_guidance": guidance,
                }
            )

        vc_col = request.query_params.get("value_counts_col")
        vc_top = int(request.query_params.get("value_counts_top", 20))
        vc_top = max(1, min(vc_top, 200))

        value_counts = None
        if vc_col:
            if vc_col not in df.columns:
                raise ValidationError(
                    {"value_counts_col": f"Unknown column '{vc_col}'."}
                )
            vc = df[vc_col].value_counts(dropna=False).head(vc_top)
            value_counts = [
                {
                    "value": None
                    if (isinstance(k, float) and math.isnan(k))
                    else str(k),
                    "count": int(v),
                }
                for k, v in vc.items()
            ]
        print("finished stats")

        return Response(
            {
                "dataset_id": dataset.id,
                "row_count": row_count,
                "columns": col_stats,
                "value_counts": value_counts,
            }
        )

    @action(detail=True, methods=["get"], url_path="clm-candidates")
    def clm_candidates(self, request, pk=None):
        dataset = self.get_object()

        max_categories_default = int(
            request.query_params.get("max_categories_default", 100)
        )
        target_max_unique = int(request.query_params.get("target_max_unique", 30))

        ignore_raw = request.query_params.get("ignore", "")
        ignore_columns = [x.strip() for x in ignore_raw.split(",") if x.strip()]

        df = load_dataset(dataset, nrows=None)

        payload = build_clm_candidates(
            df,
            max_categories_default=max_categories_default,
            target_max_unique=target_max_unique,
            ignore_columns=ignore_columns,
        )

        print("finished clm candidates")

        return Response(
            {
                "dataset_id": dataset.id,
                **payload,
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
