import { apiClient } from '@/lib/api-client';
import type { RunResult } from '@/modules/runs/domain/runs-results.type';
import type { RunsSummary } from '@/modules/runs/domain/runs-summary.type';
import type { RunWithTask } from '@/modules/runs/domain/runs-main.type';
import type { ActiveRun } from '@/modules/runs/domain/active-runs.type';

export async function getRun(runId: number): Promise<RunWithTask> {
  const result = await apiClient.get(`/runs/${runId}`);
  return result.data;
}

export async function getRuns(): Promise<RunResult[]> {
  const result = await apiClient.get('/runs/');
  return result.data;
}

export async function getRunsSummary(): Promise<RunsSummary> {
  const result = await apiClient.get('/runs/summary/');
  return result.data;
}

export async function exportRuns(): Promise<void> {
  const result = await apiClient.get('/runs/export/', {
    responseType: 'blob',
  });
  const blob = result.data as Blob;
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'runs.csv';
  a.click();

  window.URL.revokeObjectURL(url);
}

export async function getActiveRuns(): Promise<{ runs: ActiveRun[] }> {
  const res = await apiClient.get('/runs/active/');
  return res.data;
}

export async function deleteRun(id: number) {
  const response = await apiClient.delete(`/runs/${id}/`);
  return response.data;
}
