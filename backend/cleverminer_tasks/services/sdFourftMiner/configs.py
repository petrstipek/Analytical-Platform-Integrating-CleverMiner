from typing import Dict, Optional

from pydantic import BaseModel, Field

from cleverminer_tasks.services.shared.baseConfig import CedentConfig


class Sd4FtQuantifiersConfig(BaseModel):
    FrstBase: Optional[int] = Field(None, description="Min absolute rows in First Set")
    ScndBase: Optional[int] = Field(None, description="Min absolute rows in Second Set")

    FrstRelBase: Optional[float] = Field(None, description="Base divided by total items in First Set")
    ScndRelBase: Optional[float] = Field(None, description="Base divided by total items in Second Set")

    Frstconf: Optional[float] = Field(None, description="Confidence P(Succ|Ante) in First Set")
    Scndconf: Optional[float] = Field(None, description="Confidence P(Succ|Ante) in Second Set")

    Deltaconf: Optional[float] = Field(None, description="Absolute difference of confidences |Conf1 - Conf2|")

    Ratioconf: Optional[float] = Field(None, description="Relative difference (Ratio) of confidences")
    Ratioconf_leq: Optional[float] = Field(None, description="Ratio of confidences - upper bound")

    extra_params: Dict[str, float] = Field(default_factory=dict)

    class Config:
        extra = "allow"


class Sd4FtConfig(BaseModel):
    quantifiers: Sd4FtQuantifiersConfig
    ante: CedentConfig
    succ: CedentConfig
    set1: CedentConfig
    set2: CedentConfig

    cond: Optional[CedentConfig] = None
