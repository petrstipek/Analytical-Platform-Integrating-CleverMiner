import { RunResultStatus } from '@/modules/runs/domain/runs-results.type';

export type ActiveRun = {
  id: number;
  task_id: number;
  status: RunResultStatus.Queued | RunResultStatus.Running;
  started_at: string | null;
  finished_at: string | null;
  error_log?: string | null;
};
