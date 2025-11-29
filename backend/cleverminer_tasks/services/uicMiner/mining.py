from cleverminer import cleverminer
from django.utils import timezone

from cleverminer_tasks.models import AnalysisStatus
from cleverminer_tasks.services.shared.baseMining import BaseMiningService
from .config import UicMinerConfig
from .serialization import serialize_uic_result


class UICMiningService(BaseMiningService):
    def __init__(self, analysis):
        super().__init__(analysis)
        self.config = UicMinerConfig(**analysis.params)

    def run(self):
        try:
            df = self._load_dataset()
            q_dict = self.config.quantifiers.model_dump(exclude_none=True, exclude={'extra_params'})
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
                params['opts'] = self.config.opts.model_dump(exclude_none=True)

            print(
                f"Running UIC-Miner on Target: {self.config.target} with weights {self.config.quantifiers.aad_weights}")

            clm = cleverminer(**params)

            self.analysis.result = serialize_uic_result(clm, self.config.target)
            self.analysis.status = AnalysisStatus.DONE

        except Exception as e:
            self.analysis.status = AnalysisStatus.FAILED
            self.analysis.error_log = str(e)
            print(f"UIC-Miner Error: {e}")

        self.analysis.finished_at = timezone.now()
        self.analysis.save()
        return self.analysis
