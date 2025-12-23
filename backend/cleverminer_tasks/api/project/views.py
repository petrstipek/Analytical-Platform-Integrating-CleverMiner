from rest_framework import viewsets, permissions

from cleverminer_tasks.api.dataset.serializers import DatasetSerializer
from cleverminer_tasks.api.views import IsOwnerOrAdmin
from cleverminer_tasks.models import Project


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = DatasetSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        qs = Project.objects.all()
        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return qs
        if user.is_authenticated:
            return qs.filter(memberships__user=user)
        return qs.none()
