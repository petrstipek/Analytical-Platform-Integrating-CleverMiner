from cleverminer_tasks.execution.datasets.profile.clmDataGuidance import (
    clm_column_data_guidance,
)
from cleverminer_tasks.execution.utils.datasetLoader import load_dataset
from cleverminer_tasks.models import Dataset
from cleverminer import cleverminer


def build_stats(dataset: Dataset):
    df = load_dataset(dataset)

    clm = cleverminer(df=df.copy())
    category_orders = {
        var: [str(c) for c in clm.get_category_names(var)] for var in clm.get_varlist()
    }

    row_count = int(len(df))
    col_stats = []
    for c in df.columns:
        try:
            series = df[c]
            non_null = int(series.notna().sum())
            nulls = int(series.isna().sum())
            nunique = int(series.nunique(dropna=True))
            guidance = clm_column_data_guidance(
                series, str(c), max_categories_default=100
            )
            col_stats.append(
                {
                    "name": str(c),
                    "dtype": str(series.dtype),
                    "non_null": non_null,
                    "nulls": nulls,
                    "nunique": nunique,
                    "clm_guidance": guidance,
                    "visible": True,
                    "category_order": category_orders.get(str(c), None),
                }
            )
        except Exception as e:
            print(f"Warning: skipping column {c}: {e}")
            continue

    return {
        "dataset_id": dataset.id,
        "row_count": row_count,
        "columns": col_stats,
    }
