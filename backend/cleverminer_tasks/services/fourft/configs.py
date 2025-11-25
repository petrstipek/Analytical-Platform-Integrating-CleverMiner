from dataclasses import dataclass, asdict
from typing import Any, List, Optional, Dict


@dataclass
class QuantifiersConfig:
    Base: Optional[int] = None
    conf: Optional[float] = None
    aad: Optional[float] = None
    relbase: Optional[float] = None


@dataclass
class CedentConfig:
    attributes: List[str]
    minlen: int = 1
    maxlen: int = 1
    type: str = "con"


@dataclass
class FourFtConfig:
    quantifiers: QuantifiersConfig
    ante: CedentConfig
    succ: CedentConfig
    cond: Optional[CedentConfig] = None


# translation from fourft to dict to store in db
def fourft_config_to_dict(cfg: FourFtConfig) -> Dict[str, Any]:
    data = asdict(cfg)

    if data.get("cond") is None:
        data.pop("cond", None)
    return data


# translation from db dict to fourft config
def fourft_config_from_dict(data: Dict[str, Any]) -> FourFtConfig:
    quantifiers = QuantifiersConfig(**data["quantifiers"])
    ante = CedentConfig(**data["ante"])
    succ = CedentConfig(**data["succ"])

    cond_data = data.get("cond")
    cond = CedentConfig(**cond_data) if cond_data else None

    return FourFtConfig(
        quantifiers=quantifiers,
        ante=ante,
        succ=succ,
        cond=cond,
    )
