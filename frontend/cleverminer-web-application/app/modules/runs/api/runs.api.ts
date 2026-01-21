import { apiClient } from '@/lib/api-client';
import type { RunResult } from '@/modules/runs/domain/runs-results.type';
import type { RunsSummary } from '@/modules/runs/domain/runs-summary.type';

export async function getRun(runId: number): Promise<RunResult> {
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
