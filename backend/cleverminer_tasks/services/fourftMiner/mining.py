from cleverminer import (
    cleverminer
)
from django.utils import timezone

from cleverminer_tasks.models import Analysis, AnalysisStatus
from cleverminer_tasks.services.fourftMiner.configs import (
    FourFtConfig,
)
from cleverminer_tasks.services.fourftMiner.serialization import serialize_4ft_result
from cleverminer_tasks.services.shared.baseMining import BaseMiningService


class FourFtMiningService(BaseMiningService):
    def __init__(self, analysis: Analysis):
        super().__init__(analysis)
        self.config = FourFtConfig(**analysis.params)

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
            self.analysis.status = AnalysisStatus.DONE

        except Exception as e:
            self.analysis.status = AnalysisStatus.FAILED
            self.analysis.error_log = str(e)
            print(f"Mining Error: {e}")

        self.analysis.finished_at = timezone.now()
        self.analysis.save()

        return self.analysis
