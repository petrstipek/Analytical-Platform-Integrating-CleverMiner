import { apiClient } from '@/lib/api-client';

export default async function getBaseProjects() {
  const res = await apiClient.get('/projects/');
  return res.data;
}
