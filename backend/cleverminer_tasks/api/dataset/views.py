from rest_framework import permissions, viewsets

from cleverminer_tasks.api.dataset.serializers import DatasetSerializer
from cleverminer_tasks.api.views import IsOwnerOrAdmin
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