from typing import Any, Dict, List

from cleverminer_tasks.execution.shared.baseSerializer import serialize_rule_structure


def serialize_4ft_result(clm) -> Dict[str, Any]:
    rule_count = clm.get_rulecount()

    if rule_count is None:
        return {"summary": {"rule_count": 0}, "rules": [], "status": "failed"}

    rules: List[Dict[str, Any]] = []

    for rule_id in range(1, rule_count + 1):
        rules.append(
            {
                "id": rule_id,
                "text": clm.get_ruletext(rule_id),
                "quantifiers": clm.get_quantifiers(rule_id),
                "structure": serialize_rule_structure(clm, rule_id),
            }
        )

    summary = {
        "rule_count": rule_count,
    }

    return {
        "summary": summary,
        "rules": rules,
    }
