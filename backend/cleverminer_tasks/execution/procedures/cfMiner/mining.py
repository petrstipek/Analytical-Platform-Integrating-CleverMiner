from typing import Any, Dict

import pandas as pd
from cleverminer import cleverminer

from cleverminer_tasks.execution.shared.baseMining import BaseMiningService
from .config import CfMinerConfig
from .serialization import serialize_cf_result


class CfMiningService(BaseMiningService):
    def __init__(self, run):
        super().__init__(run)
        self.config = CfMinerConfig(**self.task.params)

    def _mine(self, df: pd.DataFrame) -> Dict[str, Any]:
        q_dict = self.config.quantifiers.model_dump(
            exclude_none=True, exclude={"extra_params"}
        )
        if self.config.quantifiers.extra_params:
            q_dict.update(self.config.quantifiers.extra_params)

        cond = self._build_cedent(self.config.cond)
        if not cond:
            raise ValueError("CFMiner requires 'cond' with at least one attribute.")

        params = {
            "df": df,
            "proc": "CFMiner",
            "target": self.config.target,
            "quantifiers": q_dict,
            "cond": cond,
        }

        if self.config.opts:
            params["opts"] = self.config.opts.model_dump(exclude_none=True)

        clm = cleverminer(**params)

        return serialize_cf_result(clm, self.config.target)

    def _required_attributes(self) -> list[str]:
        columns = set()

        self.add_cedent_columns(self.config.cond, columns)
        columns.add(self.config.target)

        return sorted(columns)
