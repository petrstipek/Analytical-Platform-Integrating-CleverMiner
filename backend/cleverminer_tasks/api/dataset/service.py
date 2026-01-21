from dataclasses import dataclass
from django.db import transaction

from cleverminer_tasks.models import (
    Dataset,
    DatasetSourceType,
    DatasetFormat,
    DatasetTransformation,
    RunStatus,
)
from cleverminer_tasks.execution.tasks import (
    apply_dataset_transformation,
)


@dataclass(frozen=True)
class DerivedDatasetCreated:
    dataset: Dataset
    transformation: DatasetTransformation


@transaction.atomic
def create_derived_dataset(
    *,
    input_dataset: Dataset,
    user,
    name: str,
    transform_spec: dict,
    output_format: str = DatasetFormat.PARQUET,
) -> DerivedDatasetCreated:
    output = Dataset.objects.create(
        name=name,
        owner=user,
        source_type=DatasetSourceType.GENERATED,
        source="",
        parent=input_dataset,
        file_format=output_format,
        is_ready=False,
        delimiter=input_dataset.delimiter,
        encoding=input_dataset.encoding,
    )

    transformation = DatasetTransformation.objects.create(
        output_dataset=output,
        transform_spec=transform_spec,
        status=RunStatus.QUEUED,
    )

    async_result = apply_dataset_transformation.delay(transformation.id)
    transformation.celery_task_id = async_result.id
    transformation.save(update_fields=["celery_task_id"])

    return DerivedDatasetCreated(dataset=output, transformation=transformation)
