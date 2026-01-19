import { apiClient } from '@/lib/api-client';

export async function createNewProject(name: string): Promise<void> {
  const res = await apiClient.post('/projects/', { name });
  return res.data;
}
