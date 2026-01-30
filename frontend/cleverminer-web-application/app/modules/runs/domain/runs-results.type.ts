export interface RunResultRule {
  id: number;
  text: string;
  quantifiers: {
    base: number;
    rel_base: number;
    conf: number;
    aad: number;
    bad: number;
    fourfold: [number, number, number, number];
  };
}

export interface TaskRunResult {
  summary: {
    rule_count: number;
  };
  rules: RunResultRule[];
}

export enum RunResultStatus {
  Done = 'done',
  Running = 'running',
  Error = 'error',
  Queued = 'queued',
}

export interface RunResult {
  id: number;
  status: RunResultStatus;
  result?: TaskRunResult;
  started_at: Date;
  finished_at: Date;
  updated_at: Date;
  results_summary?: {
    has_result: boolean;
    rule_count: number;
    target: string | null;
  };
}
