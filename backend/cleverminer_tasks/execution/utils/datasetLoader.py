import pandas as pd

from cleverminer_tasks.models import Dataset


def load_dataset(dataset: Dataset) -> pd.DataFrame:
    if dataset.source_type not in ["url", "local"]:
        raise ValueError(f"Unsupported source_type: {dataset.source_type}")

    encoding = getattr(dataset, "encoding", "utf-8")
    delimiter = getattr(dataset, "delimiter", ",")

    return pd.read_csv(
        dataset.source,
        encoding=encoding,
        sep=delimiter,
        low_memory=False,
    )
