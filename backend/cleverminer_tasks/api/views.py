from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from cleverminer_tasks.api.serializers import DatasetSerializer, TaskSerializer, RunSerializer
from cleverminer_tasks.models import Dataset, Task, RunStatus, Run
from cleverminer_tasks.services import run_analysis


class HealthView(APIView):
    def get(self, request):
        return Response({"status": "ok"})


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        return getattr(obj, "owner_id", None) == request.user.id


class DatasetViewSet(viewsets.ModelViewSet):
    serializer_class = DatasetSerializer
    permission_classes = [permissions.AllowAny]  # TODO, will need to switch later

    def get_queryset(self):
        qs = Dataset.objects.all()
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return qs
        if user.is_authenticated:
            return qs.filter(owner=user)
        return qs.none()

    def perform_create(self, serializer):
        owner = self.request.user if self.request.user.is_authenticated else None  # TODO, should not be None
        serializer.save(owner=owner)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.AllowAny]  # TODO, will need to switch later

    def get_queryset(self):
        qs = Task.objects.select_related("dataset").all()
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return qs
        if user.is_authenticated:
            return qs.filter(owner=user)
        return qs.none()

    def perform_create(self, serializer):
        owner = self.request.user if self.request.user.is_authenticated else None  # TODO, should not be None
        serializer.save(owner=owner)

    @action(detail=True, methods=["post"])
    def runs(self, request, pk=None):
        task = self.get_object()
        run = Run.objects.create(task=task, status=RunStatus.QUEUED)
        return Response(RunSerializer(run).data, status=status.HTTP_201_CREATED)


class RunViewSet(viewsets.ModelViewSet):
    serializer_class = RunSerializer
    permission_classes = [permissions.AllowAny]  # TODO, will need to switch later

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
