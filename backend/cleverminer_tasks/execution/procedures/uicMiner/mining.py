from typing import Dict, Any

import pandas as pd
from cleverminer import cleverminer

from cleverminer_tasks.execution.shared.baseMining import BaseMiningService
from .config import UicMinerConfig
from .serialization import serialize_uic_result


class UICMiningService(BaseMiningService):
    def __init__(self, run):
        super().__init__(run)
        self.config = UicMinerConfig(**self.task.params)

    def _mine(self, df: pd.DataFrame) -> Dict[str, Any]:
        q_dict = self.config.quantifiers.model_dump(
            exclude_none=True, exclude={"extra_params"}
        )
        if self.config.quantifiers.extra_params:
            q_dict.update(self.config.quantifiers.extra_params)

        params = {
            "df": df,
            "proc": "UICMiner",
            "target": self.config.target,
            "quantifiers": q_dict,
            "ante": self._build_cedent(self.config.ante),
        }

        if self.config.cond:
            params["cond"] = self._build_cedent(self.config.cond)

        if self.config.opts:
            params["opts"] = self.config.opts.model_dump(exclude_none=True)

        print(
            f"Running UIC-Miner on Target: {self.config.target} with weights {self.config.quantifiers.aad_weights}"
        )

        clm = cleverminer(**params)

        return serialize_uic_result(clm, self.config.target)

    def _required_attributes(self) -> list[str]:
        columns = set()

        self.add_cedent_columns(self.config.ante, columns)
        self.add_cedent_columns(self.config.cond, columns)
        columns.add(self.config.target)

        if not columns:
            raise ValueError("No required attributes resolved from task config.")
        return sorted(columns)
