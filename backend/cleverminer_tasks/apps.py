from django.apps import AppConfig


class CleverminerTasksConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "cleverminer_tasks"

    def ready(self):
        import cleverminer_tasks.signals  # noqa: F401
