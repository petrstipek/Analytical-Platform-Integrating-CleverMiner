from cleverminer import cleverminer
from django.utils import timezone

from cleverminer_tasks.models import AnalysisStatus
from cleverminer_tasks.services.sdFourftMiner.configs import Sd4FtConfig
from cleverminer_tasks.services.shared.baseMining import BaseMiningService
from cleverminer_tasks.services.shared.baseSerializer import base_serialization


class Sd4FtMiningService(BaseMiningService):
    def __init__(self, analysis):
        super().__init__(analysis)
        self.config = Sd4FtConfig(**analysis.params)

    def run(self):
        try:
            df = self._load_dataset()

            q_dict = self.config.quantifiers.model_dump(exclude_none=True, exclude={'extra_params'})
            if self.config.quantifiers.extra_params:
                q_dict.update(self.config.quantifiers.extra_params)

            params = {
                "df": df,
                "proc": "SD4ftMiner",
                "quantifiers": q_dict,
                "ante": self._build_cedent(self.config.ante),
                "succ": self._build_cedent(self.config.succ),
                "frst": self._build_cedent(self.config.set1),
                "scnd": self._build_cedent(self.config.set2),
            }

            if self.config.cond:
                params["cond"] = self._build_cedent(self.config.cond)

            clm = cleverminer(**params)

            self.analysis.result = base_serialization(clm)
            self.analysis.status = AnalysisStatus.DONE

        except Exception as e:
            self.analysis.status = "error"
            self.analysis.error_log = str(e)
            print(f"SD4ft Error: {e}")

        self.analysis.finished_at = timezone.now()
        self.analysis.save()
        return self.analysis
