import pandas as pd
from cleverminer import (
    cleverminer,
    clm_lcut,
    clm_rcut,
    clm_seq,
    clm_subset
)
from django.utils import timezone

from cleverminer_tasks.models import Analysis
from cleverminer_tasks.services.fourftMiner.configs import (
    AttributeSpec,
    CedentConfig,
    FourFtConfig,
    GaceType,
    AttributeType
)
from cleverminer_tasks.services.fourftMiner.serialization import serialize_4ft_result


class FourFtMiningService:
    def __init__(self, analysis: Analysis):
        self.analysis = analysis
        self.config = FourFtConfig(**analysis.params)

    def _load_dataset(self) -> pd.DataFrame:
        dataset = self.analysis.dataset

        if dataset.source_type != "url":
            raise ValueError(f"Unsupported source_type: {dataset.source_type}")

        encoding = getattr(dataset, 'encoding', 'utf-8')
        delimiter = getattr(dataset, 'delimiter', ',')

        try:
            df = pd.read_csv(dataset.source, encoding=encoding, sep=delimiter)
            return df
        except Exception as e:
            raise ValueError(f"Failed to load CSV from {dataset.source}: {str(e)}")

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
        if not cedent.attributes:
            return None

        attributes_prepared = [self._build_attribute(a) for a in cedent.attributes]

        return {
            "attributes": attributes_prepared,
            "minlen": cedent.minlen,
            "maxlen": cedent.maxlen,
            "type": cedent.type,
        }

    def run(self) -> Analysis:
        try:
            df = self._load_dataset()

            q_dict = self.config.quantifiers.dict(exclude_none=True, exclude={'extra_params'})

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

            self.analysis.result = serialize_4ft_result(clm)
            self.analysis.status = "done"

        except Exception as e:
            self.analysis.status = "error"
            self.analysis.error_log = str(e)
            print(f"Mining Error: {e}")

        self.analysis.finished_at = timezone.now()
        self.analysis.save()

        return self.analysis
