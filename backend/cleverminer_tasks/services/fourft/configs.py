from dataclasses import dataclass, asdict
from typing import Any, List, Optional, Dict


@dataclass
class QuantifiersConfig:
    Base: Optional[int] = None
    conf: Optional[float] = None
    aad: Optional[float] = None
    relbase: Optional[float] = None

@dataclass
class AttributeSpec:
    name: str
    attr_type: str = "subset"
    minlen: int = 1
    maxlen: int = 1

@dataclass
class CedentConfig:
    attributes: List[AttributeSpec]
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

def _cedent_from_dict(d: Dict[str, Any]) -> CedentConfig:
    attrs_raw = d.get("attributes", [])
    attrs = [AttributeSpec(**a) for a in attrs_raw]
    return CedentConfig(
        attributes=attrs,
        minlen=d.get("minlen", 1),
        maxlen=d.get("maxlen", 1),
        type=d.get("type", "con"),
    )

# translation from db dict to fourft config
def fourft_config_from_dict(data: Dict[str, Any]) -> FourFtConfig:
    quantifiers = QuantifiersConfig(**data["quantifiers"])
    ante = _cedent_from_dict(data["ante"])
    succ = _cedent_from_dict(data["succ"])

    cond_data = data.get("cond")
    cond = _cedent_from_dict(cond_data) if cond_data else None

    return FourFtConfig(
        quantifiers=quantifiers,
        ante=ante,
        succ=succ,
        cond=cond,
    )
