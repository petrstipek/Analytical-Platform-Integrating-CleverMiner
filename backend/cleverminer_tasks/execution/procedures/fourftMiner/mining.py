from typing import Dict, Any

import pandas as pd
from cleverminer import cleverminer

from cleverminer_tasks.execution.procedures.fourftMiner.configs import FourFtConfig
from cleverminer_tasks.execution.procedures.fourftMiner.serialization import (
    serialize_4ft_result,
)
from cleverminer_tasks.execution.shared.baseMining import BaseMiningService


class FourFtMiningService(BaseMiningService):
    def __init__(self, run):
        super().__init__(run)
        self.config = FourFtConfig(**self.task.params)

    def _mine(self, df: pd.DataFrame) -> Dict[str, Any]:
        q_dict = self.config.quantifiers.model_dump(
            exclude_none=True, exclude={"extra_params"}
        )
        if self.config.quantifiers.extra_params:
            q_dict.update(self.config.quantifiers.extra_params)

        params = {
            "df": df,
            "proc": "4ftMiner",
            "quantifiers": q_dict,
            "ante": self._build_cedent(self.config.ante),
            "succ": self._build_cedent(self.config.succ),
        }

        if self.config.cond:
            cond_cedent = self._build_cedent(self.config.cond)
            if cond_cedent:
                params["cond"] = cond_cedent

        clm = cleverminer(**params)

        return serialize_4ft_result(clm)
