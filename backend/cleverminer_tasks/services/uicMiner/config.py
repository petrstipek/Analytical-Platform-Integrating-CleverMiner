from typing import Dict, Optional, List

from pydantic import BaseModel, Field

from cleverminer_tasks.services.shared.baseConfig import CedentConfig, MiningOptions


class UicQuantifiersConfig(BaseModel):
    aad_weights: Optional[List[int]] = Field(None, description="Weights vector (e.g. [5, 1, 0])")
    aad_score: Optional[float] = Field(None, description="Minimum improvement score")

    Base: Optional[int] = Field(None, description="Min absolute rows")
    RelBase: Optional[float] = Field(None, description="Relative base (0.0 - 1.0)")

    extra_params: Dict[str, float] = Field(default_factory=dict)

    class Config:
        extra = "allow"


class UicMinerConfig(BaseModel):
    quantifiers: UicQuantifiersConfig
    target: str
    ante: CedentConfig
    cond: Optional[CedentConfig] = None

    opts: MiningOptions = Field(default_factory=MiningOptions)
