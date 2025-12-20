from cleverminer import cleverminer
from django.utils import timezone

from cleverminer_tasks.models import RunStatus
from cleverminer_tasks.services.shared.baseMining import BaseMiningService
from .config import CfMinerConfig
from .serialization import serialize_cf_result


class CfMiningService(BaseMiningService):
    def __init__(self, run):
        super().__init__(run)
        self.config = CfMinerConfig(**self.task.params)

    def execute(self):
        run = self.run_instance
        run.status = RunStatus.RUNNING
        run.started_at = timezone.now()
        run.error_log = None
        run.save(update_fields=["status", "started_at", "error_log"])
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

            run.result = serialize_cf_result(clm, self.config.target)
            run.status = RunStatus.DONE

        except Exception as e:
            run.status = RunStatus.FAILED
            run.error_log = str(e)

        run.finished_at = timezone.now()
        run.save(update_fields=["result", "status", "error_log", "finished_at"])
        return run
