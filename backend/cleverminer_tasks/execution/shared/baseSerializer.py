from typing import Any, Dict, List


def serialize_rule_structure(clm, rule_id: int) -> Dict[str, Any]:
    try:
        cedents = clm.get_rule_cedent_list(rule_id)
        structure = {}
        for cedent in cedents:
            variables = clm.get_rule_variables(rule_id, cedent)
            structure[cedent] = [
                {
                    "variable": var,
                    "categories": clm.get_rule_categories(rule_id, cedent, var),
                }
                for var in variables
            ]
        return structure
    except Exception:
        return {}


def base_serialization(clm) -> Dict[str, Any]:
    rule_count = clm.get_rulecount()

    if rule_count is None:
        return {"summary": {"rule_count": 0}, "rules": [], "status": "failed"}

    rules: List[Dict[str, Any]] = []

    for rule_id in range(1, rule_count + 1):
        text = clm.get_ruletext(rule_id)
        quantifiers = clm.get_quantifiers(rule_id)

        rules.append(
            {
                "id": rule_id,
                "text": text,
                "quantifiers": quantifiers,
            }
        )

    summary = {
        "rule_count": rule_count,
    }

    return {
        "summary": summary,
        "rules": rules,
    }
