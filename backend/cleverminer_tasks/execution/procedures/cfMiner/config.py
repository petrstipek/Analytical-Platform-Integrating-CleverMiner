from typing import Dict, Optional

from pydantic import BaseModel, Field

from cleverminer_tasks.execution.shared.baseConfig import CedentConfig, MiningOptions


class CfQuantifiersConfig(BaseModel):
    Base: Optional[int] = Field(None, description="Min absolute rows satisfying condition")
    RelBase: Optional[float] = Field(None, description="Relative base (0.0 - 1.0)")

    S_Up: Optional[int] = Field(None, description="Min consecutive steps UP")
    S_Down: Optional[int] = Field(None, description="Min consecutive steps DOWN")

    S_Any_Up: Optional[int] = Field(None, description="Total number of steps UP")
    S_Any_Down: Optional[int] = Field(None, description="Total number of steps DOWN")

    Max: Optional[int] = Field(None, description="Maximal value in histogram")
    Min: Optional[int] = Field(None, description="Minimal value in histogram")

    RelMax: Optional[float] = Field(None, description="Min relative peak (0.0 - 1.0)")
    RelMin: Optional[float] = Field(None, description="Min relative valley (0.0 - 1.0)")

    RelMax_leq: Optional[float] = Field(None, description="Max relative peak (Upper bound)")
    RelMin_leq: Optional[float] = Field(None, description="Max relative valley (Upper bound)")

    extra_params: Dict[str, float] = Field(default_factory=dict)

    class Config:
        extra = "allow"


class CfMinerConfig(BaseModel):
    quantifiers: CfQuantifiersConfig
    target: str
    cond: CedentConfig
    opts: MiningOptions = Field(default_factory=MiningOptions)
