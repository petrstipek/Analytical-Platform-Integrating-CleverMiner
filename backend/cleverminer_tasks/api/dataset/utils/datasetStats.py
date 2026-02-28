from cleverminer_tasks.api.dataset.utils.clmDataGuidance import clm_column_data_guidance
from cleverminer_tasks.execution.utils.datasetLoader import load_dataset
from cleverminer_tasks.models import Dataset


def build_stats(dataset: Dataset):
    df = load_dataset(dataset)

    row_count = int(len(df))
    col_stats = []
    for c in df.columns:
        series = df[c]
        non_null = int(series.notna().sum())
        nulls = int(series.isna().sum())
        nunique = int(series.nunique(dropna=True))
        guidance = clm_column_data_guidance(series, str(c), max_categories_default=100)

        col_stats.append(
            {
                "name": str(c),
                "dtype": str(series.dtype),
                "non_null": non_null,
                "nulls": nulls,
                "nunique": nunique,
                "clm_guidance": guidance,
            }
        )

    return {
        "dataset_id": dataset.id,
        "row_count": row_count,
        "columns": col_stats,
    }
