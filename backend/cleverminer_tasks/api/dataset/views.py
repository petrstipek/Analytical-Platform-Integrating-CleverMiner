import math
import pandas as pd
from pydantic import ValidationError
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from cleverminer_tasks.api.dataset.serializers import DatasetSerializer
from cleverminer_tasks.api.views import IsOwnerOrAdmin
from cleverminer_tasks.execution.utils.datasetLoader import load_dataset
from cleverminer_tasks.models import Dataset

class DatasetViewSet(viewsets.ModelViewSet):
    serializer_class = DatasetSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        qs = Dataset.objects.all()
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return qs
        if user.is_authenticated:
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
            cols.append({
                "name": str(c),
                "dtype": str(df[c].dtype),
                'null_sample': int(df[c].isnull().sum()),
                "non_null_sample": int(df[c].notna().sum()),
            })

        return Response({
            "dataset_id": dataset.id,
            "columns": cols,
        })

    @action(detail=True, methods=["get"])
    def preview(self, request, pk=None):
        dataset = self.get_object()
        rows = int(request.query_params.get("rows", 50))
        rows = max(1, min(rows, 500))

        df = load_dataset(dataset, nrows=rows)

        df.replace([float('inf'), float('-inf'), float('nan')], None, inplace=True)
        preview_records = df.where(pd.notnull(df), None).to_dict(orient="records")

        return Response({
            "dataset_id": dataset.id,
            "rows": len(preview_records),
            "columns": [str(c) for c in df.columns],
            "data": preview_records,
        })

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

            col_stats.append({
                "name": str(c),
                "dtype": str(series.dtype),
                "non_null": non_null,
                "nulls": nulls,
                "nunique": nunique,
            })

        vc_col = request.query_params.get("value_counts_col")
        vc_top = int(request.query_params.get("value_counts_top", 20))
        vc_top = max(1, min(vc_top, 200))

        value_counts = None
        if vc_col:
            if vc_col not in df.columns:
                raise ValidationError({"value_counts_col": f"Unknown column '{vc_col}'."})
            vc = df[vc_col].value_counts(dropna=False).head(vc_top)
            value_counts = [{"value": None if (isinstance(k, float) and math.isnan(k)) else str(k), "count": int(v)} for
                            k, v in vc.items()]

        return Response({
            "dataset_id": dataset.id,
            "row_count": row_count,
            "columns": col_stats,
            "value_counts": value_counts,
        })