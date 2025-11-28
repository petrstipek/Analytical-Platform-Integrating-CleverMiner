from typing import Optional

from pydantic import BaseModel

from cleverminer_tasks.services.shared.baseConfig import CedentConfig, \
    QuantifiersConfig


class FourFtConfig(BaseModel):
    quantifiers: QuantifiersConfig
    ante: CedentConfig
    succ: CedentConfig
    cond: Optional[CedentConfig] = None
