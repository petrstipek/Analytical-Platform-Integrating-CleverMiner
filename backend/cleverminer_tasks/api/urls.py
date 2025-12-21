from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import HealthView

main_router = DefaultRouter()

urlpatterns = [
    path("health/", HealthView.as_view(), name="api-health"),
    path("", include('cleverminer_tasks.api.execution.urls')),
    path("", include("cleverminer_tasks.api.procedures.urls")),
    path("", include("cleverminer_tasks.api.dataset.urls")),
]
