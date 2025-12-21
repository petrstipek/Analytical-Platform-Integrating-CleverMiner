from typing import Dict, Any, List, Literal

import pandas as pd
from pandas.api.types import is_numeric_dtype, is_bool_dtype

Recommended = Literal["nominal", "ordinal", "discretize", "ignore"]


def _is_potentially_ordinal(col_name: str) -> bool:
    name = col_name.lower()
    return any(
        k in name
        for k in ["band", "group", "range", "age", "limit", "severity", "level"]
    )


def clm_column_data_guidance(
    series: pd.Series, col_name: str, *, max_categories_default: int = 100
) -> Dict[str, Any]:
    non_null_count = int(series.notnull().sum())
    nulls_count = int(series.isnull().sum())
    unique_count = int(series.nunique(dropna=True))

    reasons: List[str] = []
    suggested_attribute_specs: List[Dict[str, Any]] = []

    if non_null_count == 0:
        return {
            "clm_usable_as_is": False,
            "recommended_representation": "ignore",
            "reasons": ["Column has no non-null values."],
            "suggested_attribute_specs": [],
            "stats": {
                "non_null": non_null_count,
                "nulls": nulls_count,
                "nunique": unique_count,
            },
        }

    if is_bool_dtype(series):
        return {
            "clm_usable_as_is": True,
            "recommended_representation": "nominal",
            "reasons": ["Boolean column detected."],
            "suggested_attribute_specs": [
                {"attr_type": "subset", "minlen": 1, "maxlen": 1}
            ],
            "stats": {
                "non_null": non_null_count,
                "nulls": nulls_count,
                "nunique": unique_count,
            },
        }

    high_cardinality = unique_count > max_categories_default
    if high_cardinality:
        reasons.append(
            f"High cardinality (nunique={unique_count}) may be ignored unless max_categories is increased."
        )

    if is_numeric_dtype(series):
        if unique_count <= 20:
            reasons.append(
                "Numeric column with low unique values, suitable as ordinal categories."
            )
            suggested_attribute_specs.append(
                {"attr_type": "seq", "minlen": 1, "maxlen": min(3, unique_count)}
            )
            return {
                "clm_usable_as_is": not high_cardinality,
                "recommended_representation": "ordinal",
                "reasons": reasons,
                "suggested_attribute_specs": suggested_attribute_specs,
                "stats": {
                    "non_null": non_null_count,
                    "nulls": nulls_count,
                    "nunique": unique_count,
                },
            }

        reasons.append(
            "Continuous numeric, recommended discretization (lcut/rcut/seq)."
        )
        suggested_attribute_specs.extend(
            [
                {"attr_type": "lcut", "minlen": 1, "maxlen": 5},
                {"attr_type": "rcut", "minlen": 1, "maxlen": 5},
                {"attr_type": "seq", "minlen": 1, "maxlen": 5},
            ]
        )
        return {
            "clm_usable_as_is": False,
            "recommended_representation": "discretize",
            "reasons": reasons,
            "suggested_attribute_specs": suggested_attribute_specs,
            "stats": {
                "non_null": non_null_count,
                "nulls": nulls_count,
                "nunique": unique_count,
            },
        }
    if unique_count <= max_categories_default:
        reasons.append(
            "Categorical/text with manageable unique values, suitable as nominal (subset)."
        )
        suggested_attribute_specs.append(
            {"attr_type": "subset", "minlen": 1, "maxlen": 1}
        )

        if _is_potentially_ordinal(col_name):
            reasons.append(
                "Column name suggests an ordered band, could be treated as ordinal (seq)."
            )
            suggested_attribute_specs.append(
                {"attr_type": "seq", "minlen": 1, "maxlen": 3}
            )

        return {
            "clm_usable_as_is": True,
            "recommended_representation": "nominal",
            "reasons": reasons,
            "suggested_attribute_specs": suggested_attribute_specs,
            "stats": {
                "non_null": non_null_count,
                "nulls": nulls_count,
                "nunique": unique_count,
            },
        }

    return {
        "clm_usable_as_is": False,
        "recommended_representation": "ignore",
        "reasons": reasons
        + ["High-cardinality text — consider grouping/encoding or exclude."],
        "suggested_attribute_specs": [],
        "stats": {
            "non_null": non_null_count,
            "nulls": nulls_count,
            "nunique": unique_count,
        },
    }
