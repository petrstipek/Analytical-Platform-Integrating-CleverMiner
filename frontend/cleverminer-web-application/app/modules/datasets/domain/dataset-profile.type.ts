export type Histogram = {
  bin_edges: number[];
  counts: number[];
  strategy: string;
  bins: number;
  skew?: number;
  auto_reason?: string;
};

export type BoxplotStats = {
  q1: number;
  median: number;
  q3: number;
  lower_whisker: number;
  upper_whisker: number;
  outlier_count: number;
};

export type NumericAttributeProfile = {
  type: 'numeric';
  stats: {
    min: number;
    max: number;
    mean: number;
    median: number;
    std: number;
    missing: number;
  } | null;
  histogram?: Histogram;
  boxplot?: BoxplotStats;
  sample_values?: number[];
};

export type CategoricalAttributeProfile = {
  type: 'categorical';
  stats: {
    unique: number;
    missing: number;
  };
  top_values: Array<{ value: string; count: number; pct: number }>;
};

export type AttributeProfile = NumericAttributeProfile | CategoricalAttributeProfile;

export type Correlation = {
  labels: string[];
  matrix: number[][];
  top_pairs: Array<{ a: string; b: string; corr: number }>;
} | null;

export type DatasetProfileResult = {
  overview: {
    rows: number;
    columns: number;
    numeric_columns: number;
    categorical_columns: number;
    missing_cells: number;
    duplicate_rows: number;
  };
  attributes: Record<string, AttributeProfile>;
  correlation: Correlation;
};
