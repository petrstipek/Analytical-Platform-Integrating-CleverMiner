from typing import Any, Dict, List


def serialize_4ft_result(clm) -> Dict[str, Any]:
    rule_count = clm.get_rulecount()

    rules: List[Dict[str, Any]] = []

    for rule_id in range(rule_count):
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
