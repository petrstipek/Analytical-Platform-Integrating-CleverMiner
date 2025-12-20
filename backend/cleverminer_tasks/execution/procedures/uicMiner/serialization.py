from typing import Any, Dict, List


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

            try:
                quantifiers = clm.get_quantifiers(rule_id)
            except Exception:
                quantifiers = {}

            hist_rule = clm.get_hist(rule_id, fullCond=False)
            hist_background = clm.get_hist_cond(rule_id)

            rules.append({
                "id": rule_id,
                "text": text,
                "quantifiers": quantifiers,
                "histogram_rule": hist_rule,
                "histogram_background": hist_background,
            })

        except Exception as e:
            print(f"Skipping rule {rule_id} due to serialization error: {e}")
            continue

    return {
        "summary": {
            "rule_count": rule_count,
            "target": target_column,
            "categories": categories
        },
        "rules": rules,
    }
