from celery import shared_task
from django.db import transaction

from cleverminer_tasks.execution.runner import run_analysis
from cleverminer_tasks.models import Run, RunStatus


@shared_task(
    bind=True,
    autoretry_for=(
        TimeoutError,
        ConnectionError,
    ),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def execute_runner_for_tasks(self, run_id: int) -> None:
    # locking the row in db, so no two workers run the same task concurrently
    with transaction.atomic():
        run = Run.objects.select_for_update().get(pk=run_id)  # row locked

        # if the task is already finished, skip it
        if run.status not in (RunStatus.QUEUED, RunStatus.FAILED):
            return

    run_analysis(run_id=run_id)
