from typing import Optional, Literal

import pandas as pd

from cleverminer_tasks.models import Dataset


def _normalize_delimiter(delimiter: str) -> str:
    if delimiter in ("\\t", "/t"):
        return "\t"
    if delimiter in ("\\n", "/n"):
        return "\n"
    return delimiter


def load_dataset(dataset: Dataset, nrows: Optional[int] = None) -> pd.DataFrame:
    if dataset.source_type not in ["url", "local"]:
        raise ValueError(f"Unsupported source_type: {dataset.source_type}")

    encoding = getattr(dataset, "encoding", "utf-8")
    delimiter = _normalize_delimiter(getattr(dataset, "delimiter", ","))

    engine: Literal["c", "python"] = "c" if len(delimiter) == 1 else "python"
    bad_lines_mode: Literal["warn", "error"] = "warn" if engine == "python" else "error"

    return pd.read_csv(
        dataset.source,
        encoding=encoding,
        sep=delimiter,
        low_memory=False,
        engine=engine,
        nrows=nrows,
        on_bad_lines=bad_lines_mode,
    )
