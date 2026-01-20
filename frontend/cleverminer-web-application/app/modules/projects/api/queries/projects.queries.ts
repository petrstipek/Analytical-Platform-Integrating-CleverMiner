import { apiClient } from '@/lib/api-client';
import type { ProjectType } from '@/modules/projects/domain/project.type';

export async function getBaseProjects(): Promise<ProjectType[]> {
  const res = await apiClient.get('/projects/');
  return res.data;
}

export async function getProject(projectId: number): Promise<ProjectType> {
  const res = await apiClient.get(`/projects/${projectId}/`);
  return res.data;
}
