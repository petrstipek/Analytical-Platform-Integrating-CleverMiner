import logging
import os
import tempfile

from charset_normalizer import from_bytes

import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
from celery import shared_task
from django.core.files import File
from django.db import transaction

from cleverminer_tasks.execution.datasets.profile.service import create_dataset_profile
from cleverminer_tasks.execution.datasets.transformations.apply_transformation import (
    apply_transform_spec,
)
from cleverminer_tasks.execution.runner import run_analysis
from cleverminer_tasks.execution.utils.datasetLoader import load_dataset
from cleverminer_tasks.models import (
    Run,
    RunStatus,
    DatasetTransformation,
    DatasetFormat,
    DatasetSourceType,
    Dataset,
    DatasetProfile,
)
from django.utils import timezone

logger = logging.getLogger(__name__)


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
            DatasetTransformation.objects.select_related(
                "output_dataset", "output_dataset__parent"
            )
            .select_for_update(of=("self",))
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
        df = load_dataset(in_ds, nrows=None, columns=None)
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

        out_ds.source_type = DatasetSourceType.GENERATED
        out_ds.source = out_ds.file.name
        out_ds.save(update_fields=["file", "source_type", "source"])

        out_ds.refresh_from_db()
        dataset_profile, _ = DatasetProfile.objects.get_or_create(dataset=out_ds)
        create_dataset_profile(dataset=out_ds, dataset_profile=dataset_profile)

        out_ds.is_ready = True
        out_ds.save(update_fields=["is_ready"])

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


@shared_task(bind=True, max_retries=3)
def convert_csv_to_parquet(self, dataset_id: int):
    try:
        dataset = Dataset.objects.get(id=dataset_id)

        with dataset.file.open("rb") as django_file:
            raw_sample = django_file.read(524_288)
        result = from_bytes(raw_sample).best()
        detected_encoding = result.encoding if result else None
        if detected_encoding and detected_encoding.lower() != dataset.encoding.lower():
            dataset.encoding = detected_encoding
            dataset.save(update_fields=["encoding"])
            logger.info(
                f"Dataset {dataset_id}: encoding auto-detected as {detected_encoding!r}"
            )

        base = os.path.splitext(os.path.basename(dataset.file.name))[0]
        parquet_filename = f"datasets/{dataset.id}/{base}.parquet"
        original_name = dataset.file.name
        storage = dataset.file.storage

        with dataset.file.open("rb") as django_file:
            sample = pd.read_csv(
                django_file.file,
                delimiter=dataset.delimiter,
                encoding=dataset.encoding,
                nrows=10_000,
                low_memory=False,
            )
            dtype_map = {}
            for col, dtype in sample.dtypes.items():
                if dtype == "object":
                    dtype_map[col] = "string"
                elif str(dtype).startswith("int"):
                    dtype_map[col] = "float64"
                else:
                    dtype_map[col] = str(dtype)
            del sample

        # Read CSV in chunks to cap memory usage
        with dataset.file.open("rb") as django_file:
            chunks = pd.read_csv(
                django_file.file,
                delimiter=dataset.delimiter,
                encoding=dataset.encoding,
                chunksize=50_000,
                dtype=dtype_map,
            )

            with tempfile.NamedTemporaryFile(suffix=".parquet", delete=False) as tmp:
                tmp_path = tmp.name

            writer = None
            try:
                for chunk in chunks:
                    for col in chunk.columns:
                        if str(chunk[col].dtype).startswith("int"):
                            chunk[col] = chunk[col].astype("float64")

                    table = pa.Table.from_pandas(chunk, preserve_index=False)
                    if writer is None:
                        writer = pq.ParquetWriter(tmp_path, table.schema)
                    writer.write_table(table)
            finally:
                if writer:
                    writer.close()

            with open(tmp_path, "rb") as f:
                dataset.file.save(parquet_filename, File(f), save=False)

            os.unlink(tmp_path)

        # Clean up original CSV from S3
        if original_name and original_name != dataset.file.name:
            storage.delete(original_name)

        dataset.source = dataset.file.name
        dataset.save(update_fields=["file", "source"])

        dataset_profile, _ = DatasetProfile.objects.get_or_create(dataset=dataset)
        create_dataset_profile(dataset=dataset, dataset_profile=dataset_profile)

        dataset.is_ready = True
        dataset.save(update_fields=["is_ready"])

        logger.info(f"Dataset {dataset_id} converted to parquet successfully.")

    except Exception as exc:
        logger.exception(f"Dataset {dataset_id} conversion failed: {exc}")
        Dataset.objects.filter(id=dataset_id).update(is_ready=False)
        raise self.retry(exc=exc, countdown=30)
