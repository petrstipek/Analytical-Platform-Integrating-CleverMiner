import type { DatasetSourceType } from '@/modules/datasets/domain/dataset.type';

export type Dataset = {
  id: number;
  name: string;
  source_type: DatasetSourceType;
  created_at: string;
  parent_id: number;
  used_in_tasks: boolean;
};

export type UploadDatasetPayload = {
  name: string;
  file: File;
  projectId?: number;
};
