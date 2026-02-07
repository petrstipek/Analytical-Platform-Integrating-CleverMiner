import type { DatasetSourceType } from '@/modules/datasets/domain/dataset.type';

export const DATASET_SOURCE_STYLES: Record<
  DatasetSourceType,
  { bg: string; text: string; ring?: string }
> = {
  url: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    ring: 'ring-blue-200',
  },
  local: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    ring: 'ring-slate-200',
  },
  storage_file: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    ring: 'ring-indigo-200',
  },
  generated: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    ring: 'ring-purple-200',
  },
};
