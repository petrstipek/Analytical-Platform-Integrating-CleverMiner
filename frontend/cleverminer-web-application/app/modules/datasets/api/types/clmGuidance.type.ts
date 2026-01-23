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

type DatasetColumnStats = {
  name: string;
  dtype: ClmStats;
  non_null: number;
  nulls: number;
  nunique: number;
  clm_guidance: ClmGuidance & {
    suggested_attribute_spec: {
      attr_type: string;
      minlen: number;
      maxlen: number;
    }[];
  };
};

export type DatasetStats = {
  dataset_id: number;
  row_count: number;
  columns: DatasetColumnStats[];
};
