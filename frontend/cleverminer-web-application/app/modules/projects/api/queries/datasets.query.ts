import { apiClient } from '@/lib/api-client';
import type { Dataset } from '@/modules/datasets/api/datasets.api';

export async function getProjectDatasets(projectId: number): Promise<Dataset[]> {
  const res = await apiClient.get(`/projects/${projectId}/datasets`);
  return res.data;
}
