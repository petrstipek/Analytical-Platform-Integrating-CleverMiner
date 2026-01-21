import os
from typing import Optional, Literal, Sequence

import pandas as pd
from django.conf import settings

from cleverminer_tasks.models import Dataset, DatasetSourceType, DatasetFormat


def _normalize_delimiter(delimiter: str) -> str:
    if delimiter in ("\\t", "/t"):
        return "\t"
    if delimiter in ("\\n", "/n"):
        return "\n"
    return delimiter


def _resolve_file_for_read(dataset: Dataset):
    if dataset.file:
        try:
            return dataset.file.path
        except NotImplementedError:
            return dataset.file.open("rb")

    if dataset.source:
        return os.path.join(settings.MEDIA_ROOT, dataset.source)

    raise ValueError("Dataset has no file and no resolvable source.")


def load_dataset(
    dataset: Dataset,
    nrows: Optional[int] = None,
    *,
    columns: Optional[Sequence[str]] = None,
) -> pd.DataFrame:
    valid_types = {
        DatasetSourceType.URL,
        DatasetSourceType.LOCAL,
        DatasetSourceType.STORAGE_FILE,
        DatasetSourceType.GENERATED,
    }

    if dataset.source_type not in valid_types:
        raise ValueError(f"Unsupported source_type: {dataset.source_type}")

    if dataset.source_type in {DatasetSourceType.URL, DatasetSourceType.LOCAL}:
        file_ref = dataset.source
    else:
        file_ref = _resolve_file_for_read(dataset)

    file_format = getattr(dataset, "file_format", DatasetFormat.CSV)

    if file_format == DatasetFormat.PARQUET:
        df = pd.read_parquet(file_ref, columns=list(columns) if columns else None)
        return df.head(nrows) if nrows is not None else df

    encoding = getattr(dataset, "encoding", "utf-8")
    delimiter = _normalize_delimiter(getattr(dataset, "delimiter", ","))

    engine: Literal["c", "python"] = "c" if len(delimiter) == 1 else "python"
    bad_lines_mode: Literal["warn", "error"] = "warn" if engine == "python" else "error"

    return pd.read_csv(
        file_ref,
        encoding=encoding,
        sep=delimiter,
        low_memory=False,
        engine=engine,
        nrows=nrows,
        on_bad_lines=bad_lines_mode,
        usecols=list(columns) if columns else None,
    )
