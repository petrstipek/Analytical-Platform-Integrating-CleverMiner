import tempfile

from celery import shared_task
from django.core.files import File
from django.db import transaction

from cleverminer_tasks.execution.datasets.service import apply_transform_spec
from cleverminer_tasks.execution.runner import run_analysis
from cleverminer_tasks.execution.utils.datasetLoader import load_dataset
from cleverminer_tasks.models import (
    Run,
    RunStatus,
    DatasetTransformation,
    DatasetFormat,
    DatasetSourceType,
)
from django.utils import timezone


@shared_task(
    bind=True,
    autoretry_for=(
        TimeoutError,
        ConnectionError,
    ),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def execute_runner_for_tasks(self, run_id: int) -> None:
    # locking the row in db, so no two workers run the same task concurrently
    with transaction.atomic():
        run = Run.objects.select_for_update().get(pk=run_id)  # row locked

        # if the task is already finished, skip it
        if run.status not in (RunStatus.QUEUED, RunStatus.FAILED):
            return

    run_analysis(run_id=run_id)


@shared_task(bind=True)
def apply_dataset_transformation(self, transformation_id: int) -> None:
    with transaction.atomic():
        tr = (
            DatasetTransformation.objects.select_for_update()
            .select_related("output_dataset", "output_dataset__parent")
            .get(id=transformation_id)
        )

        if tr.status not in (RunStatus.QUEUED, RunStatus.FAILED):
            return

        out_ds = tr.output_dataset
        in_ds = out_ds.parent

        if in_ds is None:
            tr.status = RunStatus.FAILED
            tr.error_log = "Output dataset has no parent input dataset."
            tr.finished_at = timezone.now()
            tr.save(update_fields=["status", "error_log", "finished_at"])
            return

        tr.status = RunStatus.RUNNING
        tr.started_at = timezone.now()
        tr.error_log = None
        tr.save(update_fields=["status", "started_at", "error_log"])

    try:
        df = load_dataset(in_ds, nrows=None)
        df2 = apply_transform_spec(df, tr.transform_spec)

        if out_ds.file_format == DatasetFormat.PARQUET:
            suffix = ".parquet"
        else:
            suffix = ".csv"

        with tempfile.NamedTemporaryFile(suffix=suffix) as tmp:
            if out_ds.file_format == DatasetFormat.PARQUET:
                df2.to_parquet(tmp.name, engine="pyarrow", index=False)
            else:
                df2.to_csv(
                    tmp.name,
                    index=False,
                    sep=out_ds.delimiter or ";",
                    encoding=out_ds.encoding or "utf-8",
                )

            tmp.seek(0)
            filename = f"dataset_{out_ds.id}{suffix}"
            out_ds.file.save(filename, File(tmp), save=False)

        out_ds.is_ready = True
        out_ds.source_type = DatasetSourceType.GENERATED
        out_ds.source = out_ds.file.name
        out_ds.save(update_fields=["file", "is_ready", "source_type", "source"])

        DatasetTransformation.objects.filter(id=tr.id).update(
            status=RunStatus.DONE,
            finished_at=timezone.now(),
        )

    except Exception as e:
        DatasetTransformation.objects.filter(id=transformation_id).update(
            status=RunStatus.FAILED,
            error_log=str(e),
            finished_at=timezone.now(),
        )
