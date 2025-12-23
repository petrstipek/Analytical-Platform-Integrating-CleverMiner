from dataclasses import dataclass

from celery.result import AsyncResult

from cleverminer_tasks.models import Run, RunStatus, Task
from cleverminer_tasks.execution.tasks import execute_runner_for_tasks


@dataclass(frozen=True)
class EnqueueResult:
    run: Run
    celery_task_id: str


class RunEnqueueError(Exception):
    """Domain-level error for run enqueueing."""


def create_run(*, task: Task) -> Run:
    return Run.objects.create(task=task, status=RunStatus.QUEUED)


def enqueue_run(*, run: Run) -> EnqueueResult:
    if run.status == RunStatus.QUEUED and run.celery_task_id:
        raise RunEnqueueError("Run is already queued.")

    if run.status not in (RunStatus.QUEUED, RunStatus.FAILED):
        raise RunEnqueueError(f"Run cannot be executed from status '{run.status}'.")

    async_result: AsyncResult = execute_runner_for_tasks.delay(run.id)
    run.celery_task_id = async_result.id
    run.save(update_fields=["celery_task_id"])

    return EnqueueResult(run=run, celery_task_id=async_result.id)
