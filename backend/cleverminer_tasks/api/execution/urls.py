from rest_framework.routers import DefaultRouter

from .views import DatasetViewSet, TaskViewSet, RunViewSet

router = DefaultRouter()
router.register(r"datasets", DatasetViewSet, basename="dataset")
router.register(r"tasks", TaskViewSet, basename="task")
router.register(r"runs", RunViewSet, basename="run")