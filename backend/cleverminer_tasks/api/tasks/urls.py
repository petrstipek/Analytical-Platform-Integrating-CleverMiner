from rest_framework.routers import DefaultRouter
from cleverminer_tasks.api.tasks.views import TaskViewSet

router = DefaultRouter()
router.register(r"tasks", TaskViewSet, basename="task")

urlpatterns = router.urls
