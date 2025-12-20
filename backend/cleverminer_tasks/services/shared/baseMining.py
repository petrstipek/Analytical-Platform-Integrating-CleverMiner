from abc import ABC, abstractmethod

import pandas as pd
from cleverminer import (
    clm_lcut,
    clm_rcut,
    clm_seq,
    clm_subset
)

from cleverminer_tasks.models import Run
from cleverminer_tasks.services.shared.baseConfig import AttributeSpec, AttributeType, CedentConfig, GaceType


class BaseMiningService(ABC):
    def __init__(self, run: Run):
        self.run_instance = run
        self.task = run.task
        self.dataset = self.task.dataset

    def _load_dataset(self) -> pd.DataFrame:
        dataset = self.analysis.dataset

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

    @abstractmethod
    def execute(self):
        pass
