import { apiClient } from '@/lib/api-client';
import type { DatasetSourceType } from '@/modules/datasets/domain/dataset.type';

export interface Dataset {
  id: number;
  name: string;
  source_type: DatasetSourceType;
  created_at: string;
}

export interface UploadDatasetPayload {
  name: string;
  file: File;
  projectId?: number;
}

export async function uploadDataset(payload: UploadDatasetPayload): Promise<Dataset> {
  const formData = new FormData();

  formData.append('name', payload.name);
  formData.append('file', payload.file);
  if (payload.projectId) formData.append('project_id', payload.projectId.toString());

  const res = await apiClient.post<Dataset>('/datasets/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}

export async function getDatasets(): Promise<Dataset[]> {
  const result = await apiClient.get('/datasets/');
  return result.data;
}
