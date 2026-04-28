import { useEffect, useState } from 'react';
import { elapsed } from '@/modules/tasks/utils/time-calculations';
import type { TaskRun } from '@/modules/tasks/domain/task-run.type';
import { RunResultStatus } from '@/modules/runs/domain/runs-results.type';

export default function ElapsedCell({ row }: { row: TaskRun }) {
  const isActive = RunResultStatus.Running || RunResultStatus.Queued;
  const [, tick] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  return <span>{elapsed(row.started_at, row.finished_at)}</span>;
}
