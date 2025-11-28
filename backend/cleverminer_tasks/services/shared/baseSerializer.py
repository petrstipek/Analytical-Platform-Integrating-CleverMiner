from typing import Any, Dict, List


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
