import type {
  CfSummary,
  FourftSummary,
  Sd4ftSummary,
  UicSummary,
} from '@/modules/runs/domain/procedure-summary.type';
import type {
  CfRule,
  FourftRule,
  Sd4ftRule,
  UicRule,
} from '@/modules/runs/domain/procedures-results.type';
import { ProceduresType } from '@/shared/domain/procedures.type';

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
    target?: string;
    categories?: string[];
  };
  rules: RunResultRule[];
}

export enum RunResultStatus {
  Done = 'done',
  Running = 'running',
  Failed = 'failed',
  Queued = 'queued',
  Canceled = 'canceled',
}

export interface RunResult {
  id: number;
  status: RunResultStatus;
  result?: TaskRunResult;
  started_at: Date;
  finished_at: Date;
  updated_at: Date;
  result_summary?: {
    has_result: boolean;
    rule_count: number;
    target: string | null;
  };
}

type RunResultBase = {
  id: number;
  status: RunResultStatus;
  started_at: Date;
  finished_at: Date;
  updated_at: Date;
  results_summary?: {
    has_result: boolean;
    rule_count: number;
    target: string | null;
  };
  run_snapshot?: string;
};

export type RunResultFourft = {
  procedure: ProceduresType.FOURFTMINER;
  result: {
    summary: FourftSummary;
    rules: FourftRule[];
  };
};

export type RunResultSd4ft = {
  procedure: ProceduresType.SD4FTMINER;
  run_snapshot?: string;
  result: {
    summary: Sd4ftSummary;
    rules: Sd4ftRule[];
  };
};

export type RunResultUic = {
  procedure: ProceduresType.UICMINER;
  run_snapshot?: string;
  result: {
    summary: UicSummary;
    rules: UicRule[];
  };
};

export type RunResultCf = {
  procedure: ProceduresType.CFMINER;
  run_snapshot?: string;
  result: {
    summary: CfSummary;
    rules: CfRule[];
  };
};

export type RunResultTyped = (RunResultFourft | RunResultSd4ft | RunResultUic | RunResultCf) &
  RunResultBase;
