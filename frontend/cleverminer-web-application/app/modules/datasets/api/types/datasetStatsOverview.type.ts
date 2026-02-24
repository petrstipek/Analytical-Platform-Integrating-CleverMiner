export type DatasetStatsOverview = {
  dataset_id: number;
  dataset_name: string;
  total_columns: number;
  usable_as_is: number;
  not_usable_as_is: number;
  row_count: number;
};
