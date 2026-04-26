from typing import Any, Dict, List

from cleverminer_tasks.execution.shared.baseSerializer import serialize_rule_structure


def serialize_sd4ft_result(clm) -> Dict[str, Any]:
    rule_count = clm.get_rulecount()
    if rule_count is None:
        return {"summary": {"rule_count": 0}, "rules": [], "status": "failed"}

    rules: List[Dict[str, Any]] = []
    for rule_id in range(1, rule_count + 1):
        try:
            fourfold1 = clm.get_fourfold(rule_id, order=1)
            fourfold2 = clm.get_fourfold(rule_id, order=2)
            rules.append(
                {
                    "id": rule_id,
                    "text": clm.get_ruletext(rule_id),
                    "structure": serialize_rule_structure(clm, rule_id),
                    "quantifiers": clm.get_quantifiers(rule_id),
                    "fourfold1": fourfold1,
                    "fourfold2": fourfold2,
                }
            )
        except Exception:
            continue

    return {
        "summary": {"rule_count": rule_count},
        "rules": rules,
    }
