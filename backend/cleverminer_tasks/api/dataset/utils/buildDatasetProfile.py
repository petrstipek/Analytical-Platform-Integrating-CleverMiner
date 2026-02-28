from dataclasses import dataclass
from typing import Any, Dict, List
import numpy as np
import pandas as pd


@dataclass
class ProfileOptions:
    # histogram
    histogram_bins: int = 30
    histogram_strategy: str = "auto"
    histogram_min_bins: int = 8
    histogram_max_bins: int = 80
    histogram_skew_threshold: float = 1.0  # if |skew| >= threshold -> prefer equal_freq

    # categorical
    top_categories: int = 20

    # correlation
    max_corr_columns: int = 30
    corr_threshold: float = 0.8
    sample_rows_for_corr: int | None = 100_000

    # histogram sampling
    sample_rows_for_hist: int | None = 200_000


def build_dataset_profile(
    df: pd.DataFrame, options: ProfileOptions | None = None
) -> Dict[str, Any]:
    # provides option to have other than default options
    if options is None:
        options = ProfileOptions()

    df = df.copy()
    df.replace([np.inf, -np.inf], np.nan, inplace=True)

    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    categorical_cols = df.select_dtypes(exclude=np.number).columns.tolist()

    return {
        "overview": get_dataset_overview(df),
        "attributes": build_attribute_profiles(
            df, numeric_cols, categorical_cols, options
        ),
        "correlation": compute_correlation(df, numeric_cols, options),
    }


def get_dataset_overview(df: pd.DataFrame) -> Dict[str, Any]:
    return {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "numeric_columns": int(len(df.select_dtypes(include=np.number).columns)),
        "categorical_columns": int(len(df.select_dtypes(exclude=np.number).columns)),
        "missing_cells": int(df.isna().sum().sum()),
        "duplicate_rows": int(df.duplicated().sum()),
    }


def build_attribute_profiles(
    df: pd.DataFrame,
    numeric_cols: List[str],
    categorical_cols: List[str],
    options: ProfileOptions,
) -> Dict[str, Any]:
    result = {}

    for col in numeric_cols:
        result[col] = build_numeric_profile(df[col], options)

    for col in categorical_cols:
        result[col] = build_categorical_profile(df[col], options)

    return result


def build_numeric_profile(series: pd.Series, options: ProfileOptions) -> Dict[str, Any]:
    x = series.dropna()

    if x.empty:
        return {"type": "numeric", "stats": None}

    stats = {
        "min": float(x.min()),
        "max": float(x.max()),
        "mean": float(x.mean()),
        "median": float(x.median()),
        "std": float(x.std()),
        "missing": int(series.isna().sum()),
    }

    histogram = compute_histogram(x, options)
    boxplot = compute_boxplot(x)

    return {
        "type": "numeric",
        "stats": stats,
        "histogram": histogram,
        "boxplot": boxplot,
    }


def compute_histogram(x: pd.Series, options: ProfileOptions) -> Dict[str, Any]:
    if x.empty:
        return {"bin_edges": [], "counts": [], "strategy": "empty"}

    # dataset sampling
    if options.sample_rows_for_hist and len(x) > options.sample_rows_for_hist:
        x = x.sample(options.sample_rows_for_hist, random_state=42)

    nunique = int(x.nunique(dropna=True))
    if nunique <= 1:
        # single-value column
        v = float(x.iloc[0])
        return {
            "bin_edges": [v - 0.5, v + 0.5],
            "counts": [int(len(x))],
            "strategy": "single_value",
        }

    def clamp_bins(k: int) -> int:
        return int(max(options.histogram_min_bins, min(options.histogram_max_bins, k)))

    def hist_equal_width() -> Dict[str, Any]:
        bins = clamp_bins(min(options.histogram_bins, nunique))
        counts, edges = np.histogram(x, bins=bins)
        return {
            "bin_edges": edges.tolist(),
            "counts": counts.tolist(),
            "strategy": "equal_width",
            "bins": bins,
        }

    def hist_equal_freq() -> Dict[str, Any]:
        q = clamp_bins(min(options.histogram_bins, nunique))
        try:
            cats, edges = pd.qcut(x, q=q, retbins=True, duplicates="drop")
            counts = cats.value_counts(sort=False).values
            return {
                "bin_edges": edges.tolist(),
                "counts": counts.tolist(),
                "strategy": "equal_freq",
                "bins": int(len(edges) - 1),
            }
        except ValueError:
            return hist_equal_width()

    def hist_fd() -> Dict[str, Any]:
        counts, edges = np.histogram(x, bins="fd")
        k = int(len(edges) - 1)

        if k <= 0:
            return hist_equal_width()

        if k > options.histogram_max_bins:
            return hist_equal_width()

        if k < options.histogram_min_bins:
            return hist_equal_width()

        return {
            "bin_edges": edges.tolist(),
            "counts": counts.tolist(),
            "strategy": "fd",
            "bins": k,
        }

    strategy = (options.histogram_strategy or "auto").lower()

    if strategy == "equal_width":
        return hist_equal_width()
    if strategy == "equal_freq":
        return hist_equal_freq()
    if strategy == "fd":
        return hist_fd()

    try:
        skew = float(x.skew())
    except Exception:
        skew = 0.0

    if abs(skew) >= options.histogram_skew_threshold:
        result = hist_equal_freq()
        result["skew"] = skew
        result["auto_reason"] = f"|skew| >= {options.histogram_skew_threshold}"
        return result

    result = hist_fd()
    result["skew"] = skew
    result["auto_reason"] = f"|skew| < {options.histogram_skew_threshold}"
    return result


def compute_boxplot(x: pd.Series) -> Dict[str, Any]:
    q1 = x.quantile(0.25)
    q3 = x.quantile(0.75)
    median = x.median()
    iqr = q3 - q1

    lower = max(x.min(), q1 - 1.5 * iqr)
    upper = min(x.max(), q3 + 1.5 * iqr)

    outliers = ((x < lower) | (x > upper)).sum()

    return {
        "q1": float(q1),
        "median": float(median),
        "q3": float(q3),
        "lower_whisker": float(lower),
        "upper_whisker": float(upper),
        "outlier_count": int(outliers),
    }


def build_categorical_profile(
    series: pd.Series, options: ProfileOptions
) -> Dict[str, Any]:
    value_counts = series.value_counts(dropna=True)
    total = len(series)

    top_values = value_counts.head(options.top_categories)

    return {
        "type": "categorical",
        "stats": {
            "unique": int(series.nunique(dropna=True)),
            "missing": int(series.isna().sum()),
        },
        "top_values": [
            {
                "value": str(idx),
                "count": int(count),
                "pct": float(count / total),
            }
            for idx, count in top_values.items()
        ],
    }


def compute_correlation(
    df: pd.DataFrame,
    numeric_cols: List[str],
    options: ProfileOptions,
) -> Dict[str, Any] | None:
    if len(numeric_cols) < 2:
        return None

    cols = numeric_cols[: options.max_corr_columns]
    corr_df = df[cols]

    if options.sample_rows_for_corr and len(corr_df) > options.sample_rows_for_corr:
        corr_df = corr_df.sample(options.sample_rows_for_corr, random_state=42)

    corr_matrix = corr_df.corr(method="pearson").round(3)

    top_pairs = []

    for i in range(len(cols)):
        for j in range(i + 1, len(cols)):
            value = corr_matrix.iloc[i, j]
            if abs(value) >= options.corr_threshold:
                top_pairs.append(
                    {
                        "a": cols[i],
                        "b": cols[j],
                        "corr": float(value),
                    }
                )

    return {
        "labels": cols,
        "matrix": corr_matrix.values.tolist(),
        "top_pairs": top_pairs,
    }
