from django.contrib import admin

from .models import Dataset, Task, Run


@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "source_type", "source", "created_at")
    search_fields = ("name",)
    list_filter = ("source_type",)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "procedure",
        "dataset",
        "owner",
        "created_at",
        "updated_at",
    )
    search_fields = ("name",)
    list_filter = ("procedure",)
    raw_id_fields = ("dataset", "owner")


@admin.register(Run)
class RunAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "task",
        "status",
        "created_at",
        "started_at",
        "finished_at",
    )
    list_filter = ("status",)
    raw_id_fields = ("task",)
    readonly_fields = (
        "created_at",
        "started_at",
        "finished_at",
        "result",
        "error_log",
    )
