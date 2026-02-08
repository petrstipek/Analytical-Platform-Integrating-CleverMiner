import type { RunResultStatus } from '@/modules/runs/domain/runs-results.type';

export type TaskRun = {
  id: number;
  task: number;
  status: RunResultStatus;
  error_log: string | null;
  created_at: Date;
  started_at: Date | null;
  finished_at: Date | null;
  result_summary: {
    has_result: boolean;
    rule_count: number;
    target: string | null;
  };
};
