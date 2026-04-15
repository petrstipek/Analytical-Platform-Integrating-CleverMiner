from django.db import transaction

from cleverminer_tasks.execution.datasets.profile.clmTargetCandidates import (
    build_clm_candidates,
)
from cleverminer_tasks.execution.datasets.profile.datasetColumns import (
    create_dataset_columns,
)
from cleverminer_tasks.execution.datasets.profile.datasetStats import build_stats
from cleverminer_tasks.execution.utils.datasetLoader import load_dataset
from cleverminer_tasks.models import Dataset, DatasetProfile


@transaction.atomic
def create_dataset_profile(dataset: Dataset, dataset_profile: DatasetProfile):
    dataset_stats = build_stats(dataset)
    dataset_clm_guidance = build_clm_candidates(load_dataset(dataset))
    dataset_columns = create_dataset_columns(dataset)

    dataset_profile.dataset_stats = dataset_stats
    dataset_profile.dataset_clm_guidance = dataset_clm_guidance
    dataset_profile.dataset_columns = dataset_columns
    dataset_profile.save()
