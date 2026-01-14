import type { ProceduresType } from '@/shared/domain/procedures.type';

export type Task = {
  name: string;
  dataset: number;
  procedure: ProceduresType;
  createdAt: Date;
};
