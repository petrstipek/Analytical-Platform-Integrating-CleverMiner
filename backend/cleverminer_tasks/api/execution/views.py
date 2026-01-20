from celery.result import AsyncResult
from django.utils import timezone
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from cleverminer_tasks.api.execution.serializers import (
    TaskSerializer,
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


class RunViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RunSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Run.objects.select_related("task", "task__dataset").all()
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return qs
        if user.is_authenticated:
            return qs.filter(task__owner=user)
        return qs.none()

    def get_serializer_class(self):
        if self.action == "list":
            return RunSummarySerializer
        return RunDetailSerializer

    @action(detail=True, methods=["post"])
    def execute(self, request, pk=None):
        run = self.get_object()

        try:
            enqueue_run(run=run)
        except RunEnqueueError as e:
            return Response({"error detail": str(e)}, status=status.HTTP_409_CONFLICT)

        return Response(RunSerializer(run).data, status=status.HTTP_202_ACCEPTED)

    @action(detail=True, methods=["post"])
    def stop_task_execution(self, request, pk=None):
        run = self.get_object()

        if not run.celery_task_id:
            return Response(
                {"detail": "Run has no associated Celery task."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if run.status not in (RunStatus.QUEUED, RunStatus.RUNNING):
            return Response(
                {"detail": f"Run cannot be stopped from status '{run.status}'."},
                status=status.HTTP_409_CONFLICT,
            )

        AsyncResult(run.celery_task_id).revoke(terminate=True)

        run.status = RunStatus.CANCELED
        run.finished_at = timezone.now()
        run.save(update_fields=["status", "finished_at"])

        return Response(RunSerializer(run).data, status=status.HTTP_202_ACCEPTED)
