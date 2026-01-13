import { apiClient } from '@/lib/api-client';
import type { CreateTaskFormValues } from '@/modules/tasks/utils/task-validation';

export interface TaskResponse {
  id: number;
  name: string;
  status: string;
}

export async function createTask(payload: CreateTaskFormValues): Promise<TaskResponse> {
  const apiPayload = {
    name: payload.name,
    dataset: Number(payload.dataset),
    procedure: payload.procedure,
    params: payload.configuration,
  };
  console.log('Sending formatted payload:', apiPayload);
  const res = await apiClient.post<TaskResponse>('/tasks/', apiPayload);
  return res.data;
}

export async function createAndExecuteTask(taskId: number): Promise<void> {
  await apiClient.post(`/tasks/${taskId}/create_run_and_execute/`);
}
