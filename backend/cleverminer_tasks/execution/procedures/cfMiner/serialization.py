from typing import Any, Dict, List


from cleverminer_tasks.execution.shared.baseSerializer import serialize_rule_structure


def serialize_cf_result(clm, target_column: str, df) -> Dict[str, Any]:
    hist_full = []
    rule_count = clm.get_rulecount()

    if rule_count is None:
        return {"summary": {"rule_count": 0}, "rules": [], "status": "failed"}

    try:
        categories = clm.get_dataset_category_list(target_column)
        hist_full = [int((df[target_column] == cat).sum()) for cat in categories]
    except ValueError:
        categories = []

    rules: List[Dict[str, Any]] = []

    for rule_id in range(1, rule_count + 1):
        try:
            rules.append(
                {
                    "id": rule_id,
                    "text": clm.get_ruletext(rule_id),
                    "structure": serialize_rule_structure(clm, rule_id),
                    "quantifiers": clm.get_quantifiers(rule_id),
                    "histogram": clm.get_hist(rule_id),
                    "histogram_full": hist_full,
                }
            )
        except Exception:
            continue

    return {
        "summary": {
            "rule_count": rule_count,
            "target": target_column,
            "categories": categories,
        },
        "rules": rules,
    }
