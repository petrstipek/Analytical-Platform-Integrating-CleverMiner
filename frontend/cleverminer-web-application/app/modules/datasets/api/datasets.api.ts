import { apiClient } from '@/lib/api-client';
import type { Dataset, UploadDatasetPayload } from '@/modules/datasets/api/types/datasetBase.type';

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

export async function exportDatasets(): Promise<void> {
  const res = await apiClient.get('/datasets/export/', {
    responseType: 'blob',
  });

  const blob = res.data as Blob;
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'datasets.csv';
  a.click();

  window.URL.revokeObjectURL(url);
}

export async function deleteDataset(id: number) {
  const response = await apiClient.delete(`/datasets/${id}/`);
  return response.data;
}
