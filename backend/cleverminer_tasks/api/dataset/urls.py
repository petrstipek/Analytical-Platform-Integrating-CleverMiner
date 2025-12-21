from rest_framework.routers import DefaultRouter

from cleverminer_tasks.api.dataset.views import DatasetViewSet

router = DefaultRouter()
router.register(r"datasets", DatasetViewSet, basename="dataset")

urlpatterns = router.urls
