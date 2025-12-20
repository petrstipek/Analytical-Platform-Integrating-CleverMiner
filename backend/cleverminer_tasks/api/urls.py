from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from .views import HealthView

router = DefaultRouter()
router.register(r"datasets", views.DatasetViewSet, basename="dataset")
router.register(r"tasks", views.TaskViewSet, basename="task")
router.register(r"runs", views.RunViewSet, basename="run")

urlpatterns = [
    path("health/", HealthView.as_view(), name="api-health"),
    path("", include(router.urls)),
]
