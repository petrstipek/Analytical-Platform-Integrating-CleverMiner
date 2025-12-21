from typing import Any, Dict, List


def serialize_cf_result(clm, target_column: str) -> Dict[str, Any]:
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
            quantifiers = clm.get_quantifiers(rule_id)
            text = clm.get_ruletext(rule_id)

            rules.append({
                "id": rule_id,
                "text": text,
                "quantifiers": quantifiers,
            })
        except Exception:
            continue

    return {
        "summary": {
            "rule_count": rule_count,
            "target": target_column,
            "categories": categories
        },
        "rules": rules,
    }
