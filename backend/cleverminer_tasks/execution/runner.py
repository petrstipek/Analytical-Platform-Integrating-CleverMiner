from cleverminer_tasks.models import Run
from cleverminer_tasks.registry.analysisRegistry import MINING_SERVICE_ANALYSIS_REGISTRY


def run_analysis(*, run_id: int) -> Run:
    run = Run.objects.select_related("task", "task__dataset").get(pk=run_id)

    procedure = run.task.procedure
    service_cls = MINING_SERVICE_ANALYSIS_REGISTRY.get(procedure)

    if not service_cls:
        raise ValueError(f"Unsupported procedure: {procedure}")

    service = service_cls(run)
    return service.execute()
