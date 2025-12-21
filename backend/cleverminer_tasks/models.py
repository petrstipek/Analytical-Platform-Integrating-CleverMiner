from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class DatasetSourceType(models.TextChoices):
    URL = "url", "URL"
    LOCAL = "local", "Local file"
    STORAGE_FILE = "storage_file", "Storage file"


class ProcedureType(models.TextChoices):
    FOUR_FT = "fourftMiner", "fourftMiner"
    SD4FT = "SD4ftMiner", "SD4ftMiner"
    CF_MINER = "CFMiner", "CFMiner"
    UIC_MINER = "UICMiner", "UICMiner"


class AnalysisStatus(models.TextChoices):
    CREATED = "created", "Created"
    RUNNING = "running", "Running"
    DONE = "done", "Done"
    FAILED = "failed", "Failed"


class RunStatus(models.TextChoices):
    QUEUED = "queued", "Queued"
    RUNNING = "running", "Running"
    DONE = "done", "Done"
    FAILED = "failed", "Failed"
    CANCELED = "canceled", "Canceled"


class Dataset(models.Model):
    name = models.CharField(max_length=100)

    owner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="datasets",
    )

    source_type = models.CharField(
        max_length=32,
        choices=DatasetSourceType.choices,
        default=DatasetSourceType.URL,
    )
    source = models.CharField(
        max_length=512,
    )

    delimiter = models.CharField(max_length=8, default=";")
    created_at = models.DateTimeField(auto_now_add=True)
    encoding = models.CharField(max_length=16, default="utf-8")

    def __str__(self):
        return self.name


class Task(models.Model):
    name = models.CharField(max_length=200)

    owner = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="tasks"
    )
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name="tasks")

    procedure = models.CharField(
        max_length=32, choices=ProcedureType.choices, default=ProcedureType.FOUR_FT
    )

    params = models.JSONField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.procedure})"


class Run(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="runs")

    status = models.CharField(
        max_length=16, choices=RunStatus.choices, default=RunStatus.QUEUED
    )

    result = models.JSONField(null=True, blank=True)
    error_log = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Run #{self.id} of {self.task_id} ({self.status})"
