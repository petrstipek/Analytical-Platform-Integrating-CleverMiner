import { apiClient } from '@/lib/api-client';
import type { AddProjectMemberType } from '@/modules/projects/api/domain/project.type';

export async function createNewProject(name: string): Promise<void> {
  const res = await apiClient.post('/projects/', { name });
  return res.data;
}

export async function addMember(payload: AddProjectMemberType) {
  const res = await apiClient.post(`/projects/${payload.projectId}/members/`, {
    email: payload.email,
    role: payload.role,
  });
  return res.data;
}

export async function deleteProject(projectId: number) {
  const res = await apiClient.delete(`/projects/${projectId}/`);
  return res.data;
}
