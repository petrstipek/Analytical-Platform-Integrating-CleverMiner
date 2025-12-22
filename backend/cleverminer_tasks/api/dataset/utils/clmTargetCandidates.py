from typing import Any, Dict, List, Set

import pandas as pd
from pandas.api.types import is_bool_dtype

from cleverminer_tasks.api.dataset.utils.clmDataGuidance import clm_column_data_guidance


def _is_target_candidate(series: pd.Series, *, max_unique: int) -> bool:
    if series.count() == 0:
        return False

    unique_count = int(series.nunique(dropna=True))
    if unique_count < 2:
        return False

    if is_bool_dtype(series):
        return True

    return unique_count <= max_unique


def build_clm_candidates(
    df: pd.DataFrame,
    *,
    max_categories_default: int = 100,
    target_max_unique: int = 30,
    ignore_columns: List[str] | None = None,
    sample_size: int = 50000,
) -> Dict[str, Any]:
    ignore_set: Set[str] = {
        c.strip() for c in (ignore_columns or []) if c and c.strip()
    }

    df_sample = df
    if len(df) > sample_size:
        df_sample = df.sample(n=sample_size, random_state=42)

    target_candidates: List[Dict[str, Any]] = []
    cond_candidates: List[Dict[str, Any]] = []
    ignored_candidates: List[Dict[str, Any]] = []

    total_rows = len(df)

    for col in df.columns:
        col_name = str(col)

        if col_name in ignore_set:
            ignored_candidates.append(
                {"name": col_name, "reason": "Ignored by user configuration."}
            )
            continue

        sample_series = df_sample[col]

        n_unique = int(sample_series.nunique(dropna=True))
        n_nulls = int(sample_series.isna().sum())
        non_null = int(sample_series.notna().sum())

        uniqueness_ratio = (n_unique / non_null) if non_null > 0 else 0.0
        is_id_like = (non_null > 100) and (uniqueness_ratio > 0.95)

        if is_id_like:
            ignored_candidates.append(
                {
                    "name": col_name,
                    "reason": "Likely an ID column (too many unique values).",
                    "stats": {"nunique": n_unique, "ratio": uniqueness_ratio},
                }
            )
            continue

        guidance = clm_column_data_guidance(
            sample_series, col_name, max_categories_default=max_categories_default
        )

        candidate_info = {
            "name": col_name,
            "dtype": str(df[col].dtype),
            "nunique": n_unique,
            "nulls": n_nulls,
            "clm": guidance,
        }

        if _is_target_candidate(sample_series, max_unique=target_max_unique):
            target_candidates.append(candidate_info)

        rec = guidance.get("recommended_representation")
        usable_as_is = bool(guidance.get("clm_usable_as_is", False))

        has_variance = n_unique >= 2

        if has_variance and (
            usable_as_is or rec in ("discretize", "nominal", "ordinal")
        ):
            cond_candidates.append(candidate_info)
        else:
            if not is_id_like:
                ignored_candidates.append(
                    {
                        "name": col_name,
                        "reason": "No variance or unsupported type.",
                        **candidate_info,
                    }
                )

    target_candidates.sort(key=lambda x: (x["nunique"], x["name"]))

    def _cond_sort_key(x: Dict[str, Any]) -> tuple:
        clm = x.get("clm", {})
        usable = bool(clm.get("clm_usable_as_is", False))
        return 0 if usable else 1, x["nunique"], x["name"]

    cond_candidates.sort(key=_cond_sort_key)

    ignored_candidates.sort(key=lambda x: x["name"])

    return {
        "target_candidates": target_candidates,
        "cond_candidates": cond_candidates,
        "ignored_candidates": ignored_candidates,
        "meta": {
            "max_categories_default": max_categories_default,
            "target_max_unique": target_max_unique,
            "total_rows_analyzed": total_rows,
            "sample_used": len(df) > sample_size,
        },
    }
