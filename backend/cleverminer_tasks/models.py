from django.db import models
from django.conf import settings


class DatasetSourceType(models.TextChoices):
    URL = "url", "URL"
    LOCAL = "local", "Local file"
    STORAGE_FILE = "storage_file", "Storage file"
    GENERATED = "generated", "Generated / Derived"


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


class ProjectRole(models.TextChoices):
    OWNER = "owner", "Owner"
    ADMIN = "admin", "Admin"
    EDITOR = "editor", "Editor"
    VIEWER = "viewer", "Viewer"


class DatasetFormat(models.TextChoices):
    CSV = "csv", "CSV"
    PARQUET = "parquet", "Parquet"


class Project(models.Model):
    name = models.CharField(max_length=100)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="owned_projects",
    )

    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through="ProjectMembership",
        related_name="projects",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class ProjectMembership(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="memberships"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="project_memberships",
    )
    role = models.CharField(
        max_length=16, choices=ProjectRole.choices, default=ProjectRole.VIEWER
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [("project", "user")]
        indexes = [
            models.Index(fields=["project", "user"]),
            models.Index(fields=["user", "role"]),
        ]

    def __str__(self) -> str:
        return f"{self.user_id} in {self.project_id} ({self.role})"


class Dataset(models.Model):
    name = models.CharField(max_length=100)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="datasets",
    )

    projects = models.ManyToManyField(
        "Project",
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

    file = models.FileField(upload_to="datasets/", null=True, blank=True)

    parent = models.ForeignKey(
        "self", on_delete=models.PROTECT, null=True, blank=True, related_name="children"
    )

    file_format = models.CharField(
        max_length=10,
        choices=DatasetFormat.choices,
        default=DatasetFormat.CSV,
    )

    is_ready = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if self.file:
            if self.source_type != DatasetSourceType.GENERATED:
                self.source_type = DatasetSourceType.STORAGE_FILE
            if not self.source:
                self.source = self.file.name
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class DatasetProfile(models.Model):
    dataset = models.OneToOneField(
        Dataset, on_delete=models.CASCADE, related_name="profile"
    )
    dataset_stats = models.JSONField(null=True, blank=True)
    dataset_clm_guidance = models.JSONField(null=True, blank=True)
    dataset_columns = models.JSONField(null=True, blank=True)
    dataset_eda_profile = models.JSONField(null=True, blank=True)

    schema_version = models.PositiveSmallIntegerField(default=1)

    def __str__(self):
        return f"Profile for {self.dataset.name}"


class DatasetTransformation(models.Model):
    output_dataset = models.OneToOneField(
        Dataset,
        on_delete=models.CASCADE,
        related_name="transformation",
    )

    transform_spec = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=16, choices=RunStatus.choices, default=RunStatus.QUEUED
    )
    celery_task_id = models.CharField(max_length=255, null=True, blank=True)
    error_log = models.TextField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Transformation for {self.output_dataset.name}"


class Task(models.Model):
    project = models.ForeignKey(
        "Project",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tasks",
    )

    name = models.CharField(max_length=200)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tasks",
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

    run_snapshot = models.JSONField(null=True, blank=True)
    result = models.JSONField(null=True, blank=True)
    error_log = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

    celery_task_id = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Run #{self.id} of {self.task_id} ({self.status})"
