import { StatusBadge } from '@/shared/components/atoms/StatusBadge';
import type { DatasetSourceType } from '@/modules/datasets/domain/dataset.type';
import { DATASET_SOURCE_STYLES } from '@/shared/components/styles/datasetSourceType-styling';

const DATASET_SOURCE_TYPE_LABELS: Record<DatasetSourceType, string> = {
  url: 'url',
  local: 'local',
  generated: 'generated',
  storage_file: 'storage file',
};

export function DatasetSourceTypeBadge({ sourceType }: { sourceType: DatasetSourceType }) {
  return (
    <StatusBadge
      value={sourceType}
      styles={DATASET_SOURCE_STYLES}
      labels={DATASET_SOURCE_TYPE_LABELS}
      minWidth="min-w-[80px]"
    />
  );
}
