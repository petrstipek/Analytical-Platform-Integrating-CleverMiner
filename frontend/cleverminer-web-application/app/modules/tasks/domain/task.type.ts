import type { ProceduresType } from '@/shared/domain/procedures.type';

export type Task = {
  id: number;
  name: string;
  dataset: number;
  procedure: ProceduresType;
  createdAt: Date;
  params?: any;
};
