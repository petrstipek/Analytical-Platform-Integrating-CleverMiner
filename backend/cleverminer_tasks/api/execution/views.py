from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from cleverminer_tasks.api.execution.serializers import TaskSerializer, RunSerializer
from cleverminer_tasks.api.views import IsOwnerOrAdmin
from cleverminer_tasks.execution.runner import run_analysis
from cleverminer_tasks.models import Task, RunStatus, Run


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        qs = Task.objects.select_related("dataset").all()
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return qs
        if user.is_authenticated:
            return qs.filter(owner=user)
        return qs.none()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"])
    def runs(self, request, pk=None):
        task = self.get_object()
        run = Run.objects.create(task=task, status=RunStatus.QUEUED)
        return Response(RunSerializer(run).data, status=status.HTTP_201_CREATED)


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

    @action(detail=True, methods=["post"])
    def execute(self, request, pk=None):
        run = self.get_object()

        if run.status not in [RunStatus.QUEUED, RunStatus.FAILED]:
            return Response(
                {"detail": f"Run cannot be executed from status '{run.status}'."},
                status=status.HTTP_409_CONFLICT,
            )

        run_analysis(run)
        run.refresh_from_db()

        return Response(RunSerializer(run).data)
