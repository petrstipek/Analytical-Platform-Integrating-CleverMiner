from cleverminer_tasks.models import Run
from .analysisRegistry import MINING_SERVICE_ANALYSIS_REGISTRY


def run_analysis(run: Run) -> Run:
    procedure = run.task.procedure
    service_cls = MINING_SERVICE_ANALYSIS_REGISTRY.get(procedure)

    if not service_cls:
        raise ValueError(f"Unsupported procedure: {procedure}")

    service = service_cls(run)
    return service.execute()
