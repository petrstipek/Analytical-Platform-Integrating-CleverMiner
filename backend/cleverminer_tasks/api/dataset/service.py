from dataclasses import dataclass
from django.db import transaction

from cleverminer_tasks.api.dataset.utils.clmTargetCandidates import build_clm_candidates
from cleverminer_tasks.api.dataset.utils.datasetColumns import create_dataset_columns
from cleverminer_tasks.api.dataset.utils.datasetStats import build_stats
from cleverminer_tasks.execution.utils.datasetLoader import load_dataset
from cleverminer_tasks.models import (
    Dataset,
    DatasetSourceType,
    DatasetFormat,
    DatasetTransformation,
    RunStatus,
    DatasetProfile,
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


@transaction.atomic
def create_dataset_profile(dataset: Dataset, dataset_profile: DatasetProfile):
    dataset_stats = build_stats(dataset)
    dataset_clm_guidance = build_clm_candidates(load_dataset(dataset))
    dataset_columns = create_dataset_columns(dataset)

    dataset_profile.dataset_stats = dataset_stats
    dataset_profile.dataset_clm_guidance = dataset_clm_guidance
    dataset_profile.dataset_columns = dataset_columns
    dataset_profile.save()
