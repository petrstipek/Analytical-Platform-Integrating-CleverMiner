import contextlib
import io
import traceback
from abc import ABC, abstractmethod
from typing import Dict, Any

import pandas as pd
from cleverminer import clm_lcut, clm_rcut, clm_seq, clm_subset, cleverminer
from django.utils import timezone

from cleverminer_tasks.execution.shared.baseConfig import (
    AttributeSpec,
    AttributeType,
    CedentConfig,
    GaceType,
)
from cleverminer_tasks.execution.utils.datasetLoader import load_dataset
from cleverminer_tasks.models import Run, RunStatus


class BaseMiningService(ABC):
    def __init__(self, run: Run):
        self.run_instance = run
        self.task = run.task
        self.dataset = self.task.dataset

    @staticmethod
    def _build_attribute(attr: AttributeSpec):
        if attr.attr_type == AttributeType.ONE:
            d = {"name": attr.name, "type": "one", "value": attr.value}
            if attr.gace != GaceType.POSITIVE:
                d["gace"] = attr.gace.value
            return d

        method_map = {
            AttributeType.LCUT: clm_lcut,
            AttributeType.RCUT: clm_rcut,
            AttributeType.SEQ: clm_seq,
            AttributeType.SUBSET: clm_subset,
        }

        if attr.attr_type not in method_map:
            raise ValueError(f"Unsupported attribute type: {attr.attr_type}")

        common_params = {"minlen": attr.minlen, "maxlen": attr.maxlen}
        if attr.gace != GaceType.POSITIVE:
            common_params["gace"] = attr.gace.value

        return method_map[attr.attr_type](attr.name, **common_params)

    def _build_cedent(self, cedent: CedentConfig):
        if not cedent or not cedent.attributes:
            return None
        attributes_prepared = [self._build_attribute(a) for a in cedent.attributes]
        return {
            "attributes": attributes_prepared,
            "minlen": cedent.minlen,
            "maxlen": cedent.maxlen,
            "type": cedent.type,
        }

    def execute(self) -> Run:
        run = self.run_instance
        run.status = RunStatus.RUNNING
        run.started_at = timezone.now()
        run.error_log = None
        run.save(update_fields=["status", "started_at", "error_log"])

        try:
            df = load_dataset(self.dataset, columns=self._required_attributes())
            result = self._mine(df)
            run.result = result
            run.status = RunStatus.DONE
        except Exception:
            run.status = RunStatus.FAILED
            run.error_log = traceback.format_exc()

        run.finished_at = timezone.now()
        run.save(update_fields=["result", "status", "error_log", "finished_at"])
        return run

    @staticmethod
    def add_cedent_columns(cedent: CedentConfig, columns: set[str]):
        if not cedent or not cedent.attributes:
            return
        for item in cedent.attributes:
            columns.add(item.name)

    @abstractmethod
    def _required_attributes(self) -> list[str]:
        raise NotImplementedError

    @abstractmethod
    def _mine(self, df: pd.DataFrame) -> Dict[str, Any]:
        raise NotImplementedError

    def _run_miner(self, params: dict):
        stdout_capture = io.StringIO()
        with contextlib.redirect_stdout(stdout_capture):
            clm = cleverminer(**params)
        self._check_miner_result(clm, stdout_capture)
        return clm

    def _check_miner_result(self, clm, stdout_capture: io.StringIO) -> None:
        if clm.result or clm.task_actinfo.get("proc") != "":
            return

        available = set(clm.data.get("varname", [])) if clm.data else set()
        missing = [a for a in self._required_attributes() if a not in available]

        if missing:
            max_cat = clm.options.get("max_categories", 100)
            raise ValueError(
                f"Task failed: attributes {missing} were excluded during data preparation "
                f"(exceeded {max_cat} distinct values). Consider binning these columns first."
            )

        error_lines = [
            line
            for line in stdout_capture.getvalue().splitlines()
            if line.startswith("Error:")
        ]
        if error_lines:
            raise ValueError(f"Task failed: {' | '.join(error_lines)}")

        raise ValueError("Task was not calculated. Check your configuration.")
