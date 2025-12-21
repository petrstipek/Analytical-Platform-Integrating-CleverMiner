from rest_framework.routers import DefaultRouter

from .views import TaskViewSet, RunViewSet

router = DefaultRouter()
router.register(r"tasks", TaskViewSet, basename="task")
router.register(r"runs", RunViewSet, basename="run")

urlpatterns = router.urls