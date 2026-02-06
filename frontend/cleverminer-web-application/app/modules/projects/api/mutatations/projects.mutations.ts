import { apiClient } from '@/lib/api-client';
import type { ProjectRole } from '@/modules/projects/domain/project.type';
import type { AddProjectMember } from '@/modules/projects/api/domain/project.type';

export async function createNewProject(name: string): Promise<void> {
  const res = await apiClient.post('/projects/', { name });
  return res.data;
}

export async function addMember(payload: AddProjectMember) {
  const res = await apiClient.post(`/projects/${payload.projectId}/members/`, {
    email: payload.email,
    role: payload.role,
  });
  return res.data;
}
