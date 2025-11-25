import pandas as pd
from django.utils import timezone
from cleverminer import cleverminer, clm_vars, clm_lcut

from backend.cleverminer_tasks.services.fourft.serialization import serialize_4ft_result
from cleverminer_tasks.models import Analysis, ProcedureType
from backend.cleverminer_tasks.services.fourft.configs import fourft_config_from_dict


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

    def run(self) -> Analysis:
        df = self._load_dataset()
        cfg = self.config

        q = cfg.quantifiers
        ante = cfg.ante
        succ = cfg.succ
        cond = cfg.cond

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

        ante_cedent = clm_vars(ante.attributes)

        succ_cedent = {
            "attributes": [clm_lcut(attr) for attr in succ.attributes],
            "minlen": succ.minlen,
            "maxlen": succ.maxlen,
            "type": succ.type,
        }

        params = {
            "df": df,
            "proc": "4ftMiner",
            "quantifiers": quantifiers,
            "ante": ante_cedent,
            "succ": succ_cedent,
        }

        if cond:
            cond_cedent = {
                "attributes": clm_vars(cond.attributes),
                "minlen": cond.minlen,
                "maxlen": cond.maxlen,
                "type": cond.type,
            }
            params["cond"] = cond_cedent

        clm = cleverminer(**params)

        result_payload = serialize_4ft_result(clm)

        self.analysis.result = result_payload
        self.analysis.status = "done"
        self.analysis.finished_at = timezone.now()
        self.analysis.save()

        return self.analysis
