from rest_framework.routers import DefaultRouter

from cleverminer_tasks.api.project.views import ProjectViewSet

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")

urlpatterns = router.urls
