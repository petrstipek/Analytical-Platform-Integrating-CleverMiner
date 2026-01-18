export type TaskRun = {
  id: number;
  task: number;
  status: string; // TODO = should be enum
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
