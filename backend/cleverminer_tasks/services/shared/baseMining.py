import traceback
from abc import ABC, abstractmethod
from typing import Dict, Any

import pandas as pd
from cleverminer import (
    clm_lcut,
    clm_rcut,
    clm_seq,
    clm_subset
)
from django.utils import timezone

from cleverminer_tasks.models import Run, RunStatus
from cleverminer_tasks.services.shared.baseConfig import AttributeSpec, AttributeType, CedentConfig, GaceType


class BaseMiningService(ABC):
    def __init__(self, run: Run):
        self.run_instance = run
        self.task = run.task
        self.dataset = self.task.dataset

    def _load_dataset(self) -> pd.DataFrame:
        dataset = self.dataset

        if dataset.source_type not in ["url", "local"]:
            raise ValueError(f"Unsupported source_type: {dataset.source_type}")

        encoding = getattr(dataset, 'encoding', 'utf-8')
        delimiter = getattr(dataset, 'delimiter', ',')

        try:
            df = pd.read_csv(
                dataset.source,
                encoding=encoding,
                sep=delimiter,
                low_memory=False
            )
            return df
        except Exception as e:
            raise ValueError(f"Failed to load CSV: {str(e)}")

    @staticmethod
    def _build_attribute(attr: AttributeSpec):
        method_map = {
            AttributeType.LCUT: clm_lcut,
            AttributeType.RCUT: clm_rcut,
            AttributeType.SEQ: clm_seq,
            AttributeType.SUBSET: clm_subset
        }

        common_params = {
            "minlen": attr.minlen,
            "maxlen": attr.maxlen
        }

        if attr.gace != GaceType.POSITIVE:
            common_params["gace"] = attr.gace.value

        if attr.attr_type in method_map:
            return method_map[attr.attr_type](attr.name, **common_params)
        else:
            params = {
                "name": attr.name,
                "type": attr.attr_type.value,
                **common_params
            }
            return params

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
            df = self._load_dataset()
            result = self._mine(df)
            run.result = result
            run.status = RunStatus.DONE
        except Exception:
            run.status = RunStatus.FAILED
            run.error_log = traceback.format_exc()

        run.finished_at = timezone.now()
        run.save(update_fields=["result", "status", "error_log", "finished_at"])
        return run

    @abstractmethod
    def _mine(self, df: pd.DataFrame) -> Dict[str, Any]:
        raise NotImplementedError
