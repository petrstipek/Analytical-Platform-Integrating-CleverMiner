import pandas as pd
from django.utils import timezone
from cleverminer import cleverminer, clm_vars, clm_lcut

from cleverminer_tasks.services.fourft.serialization import serialize_4ft_result
from cleverminer_tasks.models import Analysis
from cleverminer_tasks.services.fourft.configs import fourft_config_from_dict, AttributeSpec, CedentConfig


class FourFtMiningService:

    def __init__(self, analysis: Analysis):
        self.analysis = analysis
        self.config = fourft_config_from_dict(analysis.params)

    def _load_dataset(self) -> pd.DataFrame:
        dataset = self.analysis.dataset

        if dataset.source_type != "url":
            # only URL is supported for now
            raise ValueError(f"Unsupported source_type: {dataset.source_type}")

        df = pd.read_csv(dataset.source, encoding="cp1250", sep=dataset.delimiter)
        return df

    def _build_attribute_literal(self, attr: AttributeSpec):
        if attr.attr_type == "lcut":
            return clm_lcut(attr.name, minlen=attr.minlen, maxlen=attr.maxlen)
        else:
            return {
                "name": attr.name,
                "type": attr.attr_type,
                "minlen": attr.minlen,
                "maxlen": attr.maxlen,
            }

    def _build_cedent(self, cedent: CedentConfig, use_clm_vars_for_subset: bool = True):
        if not cedent.attributes:
            return None

        all_subset = all(attr.attr_type == "subset" for attr in cedent.attributes)

        if all_subset and use_clm_vars_for_subset:
            return clm_vars([a.name for a in cedent.attributes])

        attributes = [self._build_attribute_literal(a) for a in cedent.attributes]

        return {
            "attributes": attributes,
            "minlen": cedent.minlen,
            "maxlen": cedent.maxlen,
            "type": cedent.type,
        }


    def run(self) -> Analysis:
        df = self._load_dataset()
        cfg = self.config

        q = cfg.quantifiers

        quantifiers = {
            k: v
            for k, v in {
                "Base": q.Base,
                "conf": q.conf,
                "aad": q.aad,
                "relbase": q.relbase,
            }.items()
            if v is not None
        }

        ante_cedent = self._build_cedent(cfg.ante, use_clm_vars_for_subset=True)
        succ_cedent = self._build_cedent(cfg.succ, use_clm_vars_for_subset=False)

        params = {
            "df": df,
            "proc": "4ftMiner",
            "quantifiers": quantifiers,
            "ante": ante_cedent,
            "succ": succ_cedent,
        }

        if cfg.cond:
            cond_cedent = self._build_cedent(cfg.cond, use_clm_vars_for_subset=False)
            if cond_cedent:
                params["cond"] = cond_cedent

        clm = cleverminer(**params)
        result_payload = serialize_4ft_result(clm)

        self.analysis.result = result_payload
        self.analysis.status = "done"
        self.analysis.finished_at = timezone.now()
        self.analysis.save()

        return self.analysis
