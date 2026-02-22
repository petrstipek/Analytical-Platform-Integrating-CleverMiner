import csv

from django.http import HttpResponse
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from cleverminer_tasks.api.tasks.serializers import (
    TaskSerializer,
)
from cleverminer_tasks.api.runs.serializers import (
    RunSerializer,
    RunSummarySerializer,
    RunDetailSerializer,
    RunStatusSummarySerializer,
)
from cleverminer_tasks.api.execution.service import (
    create_run,
    enqueue_run,
    RunEnqueueError,
    get_run_status_summary,
)
from cleverminer_tasks.api.views import IsOwnerOrAdmin
from cleverminer_tasks.models import Task, RunStatus, Run


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

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
        qs = Task.objects.select_related("dataset").all()
        project_id = self.request.query_params.get("project")

        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return qs
        if user.is_authenticated:
            if project_id:
                return qs.filter(project_id=project_id)
            return qs.filter(owner=user)
        return qs.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["get", "post"])
    def runs(self, request, pk=None):
        task = self.get_object()

        if request.method.lower() == "get":
            qs = Run.objects.filter(task=task).order_by("-created_at")
            return Response(RunSummarySerializer(qs, many=True).data)

        run = Run.objects.create(task=task, status=RunStatus.QUEUED)
        return Response(RunDetailSerializer(run).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def create_run_and_execute(self, request, pk=None):
        task = self.get_object()
        run = create_run(task=task)

        try:
            enqueue_run(run=run)
        except RunEnqueueError as e:
            return Response({"error detail": str(e)}, status=status.HTTP_409_CONFLICT)

        return Response(RunSerializer(run).data, status=status.HTTP_202_ACCEPTED)

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        data = get_run_status_summary(user=request.user)
        serializer = RunStatusSummarySerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="export")
    def export(self, request):
        qs = self.get_queryset().select_related("dataset")

        response = HttpResponse(content_type="text/csv; charset=utf-8")
        response["Content-Disposition"] = 'attachment; filename="tasks.csv"'

        writer = csv.writer(response)
        writer.writerow(
            [
                "id",
                "name",
                "procedure",
                "project_id",
                "dataset",
                "created_at",
            ]
        )

        for task in qs.iterator(chunk_size=2000):
            writer.writerow(
                [
                    task.id,
                    task.name,
                    task.procedure,
                    task.project_id,
                    task.dataset.name if task.dataset else "",
                    task.created_at.isoformat(),
                ]
            )

        return response
