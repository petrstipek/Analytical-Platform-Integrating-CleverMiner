import os
from typing import Optional, Literal

import pandas as pd
from django.conf import settings

from cleverminer_tasks.models import Dataset, DatasetSourceType


def _normalize_delimiter(delimiter: str) -> str:
    if delimiter in ("\\t", "/t"):
        return "\t"
    if delimiter in ("\\n", "/n"):
        return "\n"
    return delimiter


def load_dataset(dataset: Dataset, nrows: Optional[int] = None) -> pd.DataFrame:
    valid_types = [
        DatasetSourceType.URL,
        DatasetSourceType.LOCAL,
        DatasetSourceType.STORAGE_FILE,
    ]

    if dataset.source_type not in valid_types:
        raise ValueError(f"Unsupported source_type: {dataset.source_type}")

    file_path = dataset.source

    if dataset.source_type == DatasetSourceType.STORAGE_FILE:
        if dataset.file:
            try:
                file_path = dataset.file.path
            except NotImplementedError:
                file_path = dataset.file.url
        else:
            file_path = os.path.join(settings.MEDIA_ROOT, dataset.source)

    encoding = getattr(dataset, "encoding", "utf-8")
    delimiter = _normalize_delimiter(getattr(dataset, "delimiter", ","))

    engine: Literal["c", "python"] = "c" if len(delimiter) == 1 else "python"
    bad_lines_mode: Literal["warn", "error"] = "warn" if engine == "python" else "error"

    return pd.read_csv(
        file_path,
        encoding=encoding,
        sep=delimiter,
        low_memory=False,
        engine=engine,
        nrows=nrows,
        on_bad_lines=bad_lines_mode,
        storage_options=None,
    )
