from enum import Enum
from typing import Dict, List, Optional, Literal
from pydantic import BaseModel, Field

class AttributeType(str, Enum):
    SUBSET = "subset"
    LCUT = "lcut"
    RCUT = "rcut"
    SEQ = "seq"
    ONE = "one"


class GaceType(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    BOTH = "both"


class AttributeSpec(BaseModel):
    name: str
    attr_type: AttributeType = AttributeType.SUBSET
    minlen: int = 1
    maxlen: int = 1
    gace: GaceType = GaceType.POSITIVE


class CedentConfig(BaseModel):
    attributes: List[AttributeSpec]
    minlen: int = 1
    maxlen: int = 1
    type: Literal["con", "dis"] = "con"


class QuantifiersConfig(BaseModel):
    Base: Optional[int] = None
    conf: Optional[float] = None
    aad: Optional[float] = None
    relbase: Optional[float] = None
    extra_params: Dict[str, float] = Field(default_factory=dict)

    class Config:
        extra = "allow"


class FourFtConfig(BaseModel):
    quantifiers: QuantifiersConfig
    ante: CedentConfig
    succ: CedentConfig
    cond: Optional[CedentConfig] = None