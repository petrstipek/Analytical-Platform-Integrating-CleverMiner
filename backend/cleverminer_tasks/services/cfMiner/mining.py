from cleverminer import cleverminer
from django.utils import timezone

from cleverminer_tasks.models import AnalysisStatus
from cleverminer_tasks.services.shared.baseMining import BaseMiningService
from .config import CfMinerConfig
from .serialization import serialize_cf_result


class CfMiningService(BaseMiningService):
    def __init__(self, analysis):
        super().__init__(analysis)
        self.config = CfMinerConfig(**analysis.params)

    def run(self):
        try:
            df = self._load_dataset()

            q_dict = self.config.quantifiers.model_dump(exclude_none=True, exclude={'extra_params'})
            if self.config.quantifiers.extra_params:
                q_dict.update(self.config.quantifiers.extra_params)

            params = {
                "df": df,
                "proc": "CFMiner",
                "target": self.config.target,
                "quantifiers": q_dict,
                "cond": self._build_cedent(self.config.cond),
            }

            if self.config.opts:
                params['opts'] = self.config.opts.model_dump(exclude_none=True)

            print(f"Running CF-Miner on Target: {self.config.target}")

            clm = cleverminer(**params)

            self.analysis.result = serialize_cf_result(clm, self.config.target)
            self.analysis.status = AnalysisStatus.DONE

        except Exception as e:
            self.analysis.status = AnalysisStatus.FAILED
            self.analysis.error_log = str(e)
            print(f"CF-Miner Error: {e}")

        self.analysis.finished_at = timezone.now()
        self.analysis.save()
        return self.analysis
