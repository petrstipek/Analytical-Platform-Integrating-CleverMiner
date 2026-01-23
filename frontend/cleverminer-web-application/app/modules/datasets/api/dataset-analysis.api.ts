import { apiClient } from '@/lib/api-client';
import type {
  ClmAnalysisResponse,
  DatasetPreviewResponse,
  DatasetStats,
} from '@/modules/datasets/api/types/clmGuidance.type';

export async function getDatasetPreview(id: number) {
  const res = await apiClient.get<DatasetPreviewResponse>(`/datasets/${id}/preview/?rows=20`);
  return res.data;
}

export async function getDatasetAnalysis(id: number) {
  const res = await apiClient.get<ClmAnalysisResponse>(`/datasets/${id}/clm-candidates/`);
  return res.data;
}

export async function getDatasetAnalysisStats(id: number): Promise<DatasetStats[]> {
  const res = await apiClient.get<DatasetStats[]>(`/datasets/${id}/stats/`);
  return res.data;
}
