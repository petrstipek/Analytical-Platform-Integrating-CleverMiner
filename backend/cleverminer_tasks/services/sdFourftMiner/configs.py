from typing import Optional

from pydantic import BaseModel

from cleverminer_tasks.services.shared.baseConfig import CedentConfig, \
    QuantifiersConfig


class Sd4FtConfig(BaseModel):
    quantifiers: QuantifiersConfig
    ante: CedentConfig
    succ: CedentConfig
    set1: CedentConfig
    set2: CedentConfig

    cond: Optional[CedentConfig] = None
