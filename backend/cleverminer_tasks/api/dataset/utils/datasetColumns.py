from cleverminer_tasks.execution.utils.datasetLoader import load_dataset
from cleverminer_tasks.models import Dataset


def create_dataset_columns(dataset: Dataset):
    df = load_dataset(dataset)

    cols = []
    for c in df.columns:
        cols.append(
            {
                "name": str(c),
                "dtype": str(df[c].dtype),
                "null_sample": int(df[c].isnull().sum()),
                "non_null_sample": int(df[c].notna().sum()),
            }
        )

    return cols
