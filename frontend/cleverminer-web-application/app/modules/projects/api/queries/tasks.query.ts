import { apiClient } from '@/lib/api-client';
import type { Task } from '@/modules/tasks/domain/task.type';

export async function getTasksForProject(projectId: number): Promise<Task[]> {
  const res = await apiClient.get('/tasks/', {
    params: {
      project: projectId,
    },
  });
  return res.data;
}
