import { apiClient } from '@/lib/api-client';
import type { ProjectType } from '@/modules/projects/domain/project.type';
import type { RunResult } from '@/modules/runs/domain/runs-results.type';

export async function getBaseProjects(): Promise<ProjectType[]> {
  const res = await apiClient.get('/projects/');
  return res.data;
}

export async function getProject(projectId: number): Promise<ProjectType> {
  const res = await apiClient.get(`/projects/${projectId}/`);
  return res.data;
}

export async function getProjectRuns(projectId: number): Promise<RunResult[]> {
  const res = await apiClient.get(`/projects/${projectId}/runs/`);
  return res.data;
}
