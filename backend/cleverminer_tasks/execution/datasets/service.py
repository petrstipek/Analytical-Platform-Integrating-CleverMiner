import pandas as pd


def apply_transform_spec(df: pd.DataFrame, spec: dict) -> pd.DataFrame:
    steps = spec.get("steps", [])
    out = df.copy(deep=True)

    for step in steps:
        op = step.get("op")

        if op == "fillna":
            col = step["column"]
            strategy = step["strategy"]

            if strategy == "mean":
                out[col] = out[col].fillna(out[col].mean())
            elif strategy == "median":
                out[col] = out[col].fillna(out[col].median())
            elif strategy == "mode":
                mode = out[col].mode(dropna=True)
                out[col] = out[col].fillna(mode.iloc[0] if not mode.empty else None)
            elif strategy == "constant":
                out[col] = out[col].fillna(step.get("value"))
            else:
                raise ValueError(f"Unknown fillna strategy: {strategy}")

        elif op == "drop_columns":
            cols = step.get("columns", [])
            out = out.drop(columns=cols, errors="ignore")

        elif op == "drop_rows":
            where = step.get("where", {})
            col = where["column"]

            if where.get("is_null") is True:
                out = out[out[col].notna()]
            elif "lt" in where:
                out = out[out[col] >= where["lt"]]
            elif "gt" in where:
                out = out[out[col] <= where["gt"]]
            elif "in" in where:
                out = out[~out[col].isin(where["in"])]
            else:
                raise ValueError(f"Unsupported drop_rows where: {where}")

        elif op == "bin":
            col = step["column"]
            output_col = step.get("output_column", f"{col}_bin")
            method = step.get("method")

            if method == "quantile":
                k = int(step["k"])
                out[output_col] = pd.qcut(out[col], q=k, duplicates="drop")
            elif method == "equal_width":
                k = int(step["k"])
                out[output_col] = pd.cut(out[col], bins=k)
            elif method == "explicit":
                bins = step["bins"]
                labels = step.get("labels")
                out[output_col] = pd.cut(
                    out[col], bins=bins, labels=labels, include_lowest=True
                )
            else:
                raise ValueError(f"Unknown bin method: {method}")

        else:
            raise ValueError(f"Unknown op: {op}")

    return out
