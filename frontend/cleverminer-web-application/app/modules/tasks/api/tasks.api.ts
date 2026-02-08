import { apiClient } from '@/lib/api-client';
import type { CreateTaskFormValues } from '@/modules/tasks/utils/task-validation';
import type { Task, TasksSummary } from '@/modules/tasks/domain/task.type';
import type { DatasetType } from '@/modules/datasets/domain/dataset.type';
import type { DatasetsColumnsType } from '@/modules/datasets/domain/datasetsColumns.type';
import type { TaskRun } from '@/modules/tasks/domain/task-run.type';

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
  const res = await apiClient.post<TaskResponse>('/tasks/', apiPayload);
  return res.data;
}

export async function createAndExecuteTask(taskId: number): Promise<void> {
  await apiClient.post(`/tasks/${taskId}/create_run_and_execute/`);
}

export async function getTasks(): Promise<Task[]> {
  const res = await apiClient.get('/tasks/');
  return res.data;
}

export async function getTask(id: number): Promise<Task> {
  const res = await apiClient.get(`/tasks/${id}/`);
  return res.data;
}

export async function getDatasets(): Promise<DatasetType[]> {
  const res = await apiClient.get('/datasets/');
  return res.data;
}

export async function getDatasetsColumns(datasetId: number): Promise<DatasetsColumnsType[]> {
  const res = await apiClient.get(`/datasets/${datasetId}/columns/`);
  return res.data.columns;
}

export async function getRunsForTask(taskId: number): Promise<TaskRun[]> {
  const res = await apiClient.get(`/tasks/${taskId}/runs/`);
  return res.data;
}

export async function updateTask(
  taskId: number,
  payload: CreateTaskFormValues,
): Promise<TaskResponse> {
  const apiPayload = {
    name: payload.name,
    dataset: Number(payload.dataset),
    procedure: payload.procedure,
    params: payload.configuration,
  };
  const res = await apiClient.patch(`/tasks/${taskId}/`, apiPayload);
  return res.data;
}

export async function getTasksSummary(): Promise<TasksSummary> {
  const res = await apiClient.get('/tasks/summary/');
  return res.data;
}

export async function exportTasks(): Promise<void> {
  const res = await apiClient.get('/tasks/export/', {
    responseType: 'blob',
  });

  const blob = res.data as Blob;
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks.csv';
  a.click();

  window.URL.revokeObjectURL(url);
}
