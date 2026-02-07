export type DatasetType = {
  id: number;
  name: string;
  owner: number;
  source_type: DatasetSourceType;
  delimiter: string;
  encoding: string;
  created_at: Date;
  file: string;
};

export enum DatasetSourceType {
  url = 'url',
  local = 'local',
  storage_file = 'storage_file',
  generated = 'generated',
}
