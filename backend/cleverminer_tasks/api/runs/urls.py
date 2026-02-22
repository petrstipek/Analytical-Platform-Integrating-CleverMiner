from rest_framework.routers import DefaultRouter

from cleverminer_tasks.api.runs.views import RunViewSet

router = DefaultRouter()
router.register(r"runs", RunViewSet, basename="run")

urlpatterns = router.urls
