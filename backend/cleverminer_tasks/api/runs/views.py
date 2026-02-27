import csv

from celery.result import AsyncResult
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from cleverminer_tasks.api.runs.serializers import (
    RunSerializer,
    RunSummarySerializer,
    RunDetailSerializer,
    RunStatusSummarySerializer,
)
from cleverminer_tasks.api.execution.service import (
    enqueue_run,
    RunEnqueueError,
    get_run_status_summary,
)
from cleverminer_tasks.models import RunStatus, Run


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

    # exposing only delete since runs are crated internally
    def destroy(self, request, pk=None):
        run = self.get_object()
        run.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        data = get_run_status_summary(user=request.user)
        serializer = RunStatusSummarySerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="export")
    def export(self, request):
        qs = self.get_queryset().select_related("task")

        response = HttpResponse(content_type="text/csv; charset=utf-8")
        response["Content-Disposition"] = 'attachment; filename="runs.csv"'

        writer = csv.writer(response)
        writer.writerow(["id", "task", "status", "started_at", "result"])

        for run in qs.iterator(chunk_size=2000):
            writer.writerow([run.id, run.task, run.status, run.started_at, run.result])

        return response

    @action(detail=True, methods=["get"], url_path="status")
    def status(self, request, pk=None):
        run = self.get_object()
        return Response(
            {
                "id": run.id,
                "status": run.status,
                "started_at": run.started_at,
                "finished_at": run.finished_at,
                "error_log": run.error_log if run.status == RunStatus.FAILED else None,
            }
        )

    @action(detail=False, methods=["get"], url_path="active")
    def active(self, request):
        active_statuses = [RunStatus.QUEUED, RunStatus.RUNNING]

        qs = (
            self.get_queryset()
            .filter(status__in=active_statuses)
            .only("id", "status", "started_at", "finished_at", "error_log", "task_id")
            .order_by("-started_at", "-id")
        )

        data = [
            {
                "id": run.id,
                "task_id": run.task_id,
                "status": run.status,
                "started_at": run.started_at,
                "finished_at": run.finished_at,
                "error_log": run.error_log if run.status == RunStatus.FAILED else None,
            }
            for run in qs
        ]

        return Response({"runs": data})
