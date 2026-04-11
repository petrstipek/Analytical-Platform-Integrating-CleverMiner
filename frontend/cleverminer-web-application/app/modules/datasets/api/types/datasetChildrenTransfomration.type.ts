import type { TransformStep } from '@/modules/datasets/domain/datasetTransformations.type';

export type RunStatus = 'queued' | 'running' | 'done' | 'failed' | 'canceled';

export type TransformationSpec = {
  steps: TransformStep[];
};

export type Transformation = {
  transformation_id: number;
  status: RunStatus;
  transform_spec: TransformationSpec;
  created_at: string;
  started_at: string;
  finished_at: string;
  error_log: string;
};

export type DatasetChildren = {
  dataset_id: number;
  dataset_name: string;
  created_at: string;
  is_ready: boolean;
  file_format: string;
  transformation: Transformation;
};

export type DatasetChildrenTransformation = {
  dataset_id: number;
  children: DatasetChildren[];
};
