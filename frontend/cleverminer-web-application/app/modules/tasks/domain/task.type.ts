import type { ProceduresType } from '@/shared/domain/procedures.type';

export type Task = {
  id: number;
  name: string;
  dataset: number;
  procedure: ProceduresType;
  createdAt: Date;
  params?: any;
  updated_at?: Date;
  created_at: Date;
};

export type TasksSummary = {
  total: number;
  queued: number;
  running: number;
  failed: number;
  done: number;
  canceled: number;
};
