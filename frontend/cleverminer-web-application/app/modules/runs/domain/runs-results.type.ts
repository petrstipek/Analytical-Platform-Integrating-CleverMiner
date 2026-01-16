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

export interface RunResult {
  id: number;
  status: 'done' | 'running' | 'error' | 'queued';
  result?: TaskRunResult;
  started_at: Date;
  finished_at: Date;
  updated_at: Date;
}
