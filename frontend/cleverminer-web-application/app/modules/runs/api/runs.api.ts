import { apiClient } from '@/lib/api-client';
import type { RunResult } from '@/modules/runs/domain/runs-results.type';

export async function getRun(runId: number): Promise<RunResult> {
  const result = await apiClient.get(`/runs/${runId}`);
  return result.data;
}
