from django.contrib import admin
from .models import Dataset, Analysis


@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "source_type", "source", "created_at")


@admin.register(Analysis)
class AnalysisAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "procedure",
        "status",
        "created_at",
        "owner",
        "params",
    )
