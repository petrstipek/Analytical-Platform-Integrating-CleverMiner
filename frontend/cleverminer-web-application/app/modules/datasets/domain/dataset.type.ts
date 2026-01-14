export type DatasetType = {
  id: number;
  name: string;
  owner: number;
  source_type: string;
  delimiter: string;
  encoding: string;
  created_at: Date;
  file: string;
};
