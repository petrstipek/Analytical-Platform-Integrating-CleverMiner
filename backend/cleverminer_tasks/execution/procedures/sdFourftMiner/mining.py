from typing import Dict, Any

import pandas as pd
from cleverminer import cleverminer

from cleverminer_tasks.execution.procedures.sdFourftMiner.configs import Sd4FtConfig
from cleverminer_tasks.execution.shared.baseMining import BaseMiningService
from cleverminer_tasks.execution.shared.baseSerializer import base_serialization


class Sd4FtMiningService(BaseMiningService):
    def __init__(self, run):
        super().__init__(run)
        self.config = Sd4FtConfig(**self.task.params)

    def _mine(self, df: pd.DataFrame) -> Dict[str, Any]:
        q_dict = self.config.quantifiers.model_dump(
            exclude_none=True, exclude={"extra_params"}
        )
        if self.config.quantifiers.extra_params:
            q_dict.update(self.config.quantifiers.extra_params)

        params = {
            "df": df,
            "proc": "SD4ftMiner",
            "quantifiers": q_dict,
            "ante": self._build_cedent(self.config.ante),
            "succ": self._build_cedent(self.config.succ),
            "frst": self._build_cedent(self.config.set1),
            "scnd": self._build_cedent(self.config.set2),
        }

        if self.config.opts:
            params["opts"] = self.config.opts.model_dump(exclude_none=True)

        if self.config.cond:
            params["cond"] = self._build_cedent(self.config.cond)

        clm = cleverminer(**params)

        return base_serialization(clm)
