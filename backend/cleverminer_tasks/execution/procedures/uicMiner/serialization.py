import io
import re
import sys
from typing import Any, Dict, List

from cleverminer_tasks.execution.shared.baseSerializer import serialize_rule_structure


def get_uic_aad(clm, rule_id: int) -> float | None:
    buffer = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = buffer
    try:
        clm.print_rule(rule_id)
    finally:
        sys.stdout = old_stdout
    output = buffer.getvalue()
    match = re.search(r"aad score\s*:\s*([\d.]+)", output)
    return float(match.group(1)) if match else None


def serialize_uic_result(clm, target_column: str) -> Dict[str, Any]:
    rule_count = clm.get_rulecount()

    if rule_count is None:
        return {"summary": {"rule_count": 0}, "rules": [], "status": "failed"}

    try:
        categories = clm.get_dataset_category_list(target_column)
    except Exception:
        categories = []

    rules: List[Dict[str, Any]] = []

    for rule_id in range(1, rule_count + 1):
        try:
            try:
                text = clm.get_ruletext(rule_id)
            except Exception:
                text = f"UIC Rule #{rule_id}"

            hist_rule = clm.get_hist(rule_id, fullCond=False)
            hist_background = clm.get_hist_cond(rule_id)

            try:
                quantifiers = clm.get_quantifiers(rule_id) or {}
            except Exception:
                quantifiers = {}

            if hist_rule and hist_background:
                rule_total = sum(hist_rule)
                bg_total = sum(hist_background)
                rel_hist_rule = (
                    [v / rule_total for v in hist_rule] if rule_total else []
                )
                rel_hist_bg = (
                    [v / bg_total for v in hist_background] if bg_total else []
                )
                times_more = [
                    (rel_hist_rule[i] / rel_hist_bg[i]) if rel_hist_bg[i] else 0
                    for i in range(len(hist_rule))
                ]
                quantifiers.update(
                    {
                        "base": rule_total,
                        "rel_base": rule_total / bg_total if bg_total else 0,
                        "aad": get_uic_aad(clm, rule_id),
                        "rel_hist_rule": rel_hist_rule,
                        "rel_hist_background": rel_hist_bg,
                        "times_more": times_more,
                    }
                )

            rules.append(
                {
                    "id": rule_id,
                    "text": text,
                    "quantifiers": quantifiers,
                    "structure": serialize_rule_structure(clm, rule_id),
                    "histogram_rule": hist_rule,
                    "histogram_background": hist_background,
                }
            )

        except Exception as e:
            print(f"Skipping rule {rule_id} due to serialization error: {e}")
            continue

    return {
        "summary": {
            "rule_count": rule_count,
            "target": target_column,
            "categories": categories,
        },
        "rules": rules,
    }
