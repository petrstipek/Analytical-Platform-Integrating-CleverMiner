import { apiClient } from '@/lib/api-client';

export interface Dataset {
  id: number;
  name: string;
  source_type: string;
  created_at: string;
}

export interface UploadDatasetPayload {
  name: string;
  file: File;
}

export async function uploadDataset(payload: UploadDatasetPayload): Promise<Dataset> {
  const formData = new FormData();

  formData.append('name', payload.name);
  formData.append('file', payload.file);

  const res = await apiClient.post<Dataset>('/datasets/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}
