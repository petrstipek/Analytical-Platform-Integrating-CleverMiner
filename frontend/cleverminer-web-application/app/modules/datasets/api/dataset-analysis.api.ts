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

export async function getDatasetAnalysisStats(id: number): Promise<DatasetStats> {
  const res = await apiClient.get<DatasetStats>(`/datasets/${id}/stats/`);
  return res.data;
}

export async function createDerivedDataset(
  datasetId: string,
  payload: {
    name: string;
    transform_spec: object;
    output_format: 'csv' | 'parquet';
  },
) {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('output_format', payload.output_format);
  form.append('transform_spec', JSON.stringify(payload.transform_spec));

  const res = await apiClient.post(`/datasets/${datasetId}/create-derived/`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
}
