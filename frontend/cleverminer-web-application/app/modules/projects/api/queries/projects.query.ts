import { apiClient } from '@/lib/api-client';
import type { ProjectType } from '@/modules/projects/domain/project.type';
import type { RunResult } from '@/modules/runs/domain/runs-results.type';
import type { ProjectMember } from '@/modules/projects/domain/member.type';
import type { ProjectSummary } from '@/modules/projects/api/domain/project.type';

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

export async function getProjectMembers(projectId: number): Promise<ProjectMember[]> {
  const res = await apiClient.get(`/projects/${projectId}/members/`);
  return res.data;
}

export async function getProjectSummary(projectId: number): Promise<ProjectSummary> {
  const res = await apiClient.get(`/projects/${projectId}/summary/`);
  return res.data;
}
