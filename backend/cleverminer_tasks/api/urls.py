from django.urls import path, include
from .execution.urls import router
from .views import HealthView

urlpatterns = [
    path("health/", HealthView.as_view(), name="api-health"),
    path("", include(router.urls)),
    path("", include("cleverminer_tasks.api.procedures.urls")),
]
