import { apiClient } from '@/lib/api-client';

export interface ClmStats {
  non_null: number;
  nulls: number;
  nunique: number;
}

export interface ClmGuidance {
  clm_usable_as_is: boolean;
  recommended_representation: 'nominal' | 'ordinal' | 'discretize' | 'ignore';
  reasons: string[];
  stats: ClmStats;
}

export interface ClmCandidate {
  name: string;
  dtype?: string;
  nunique?: number;
  nulls?: number;
  clm?: ClmGuidance;
  reason?: string;
  stats?: ClmStats;
}

export interface ClmAnalysisResponse {
  dataset_id: number;
  target_candidates: ClmCandidate[];
  cond_candidates: ClmCandidate[];
  ignored_candidates: ClmCandidate[];
  meta: {
    total_rows_analyzed: number;
  };
}

export interface DatasetPreviewResponse {
  dataset_id: number;
  rows: number;
  columns: string[];
  data: Record<string, any>[];
}

export async function getDatasetPreview(id: number) {
  const res = await apiClient.get<DatasetPreviewResponse>(`/datasets/${id}/preview/?rows=20`);
  return res.data;
}

export async function getDatasetAnalysis(id: number) {
  const res = await apiClient.get<ClmAnalysisResponse>(`/datasets/${id}/clm-candidates/`);
  return res.data;
}
