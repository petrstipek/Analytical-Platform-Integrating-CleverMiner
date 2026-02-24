import type { DatasetProfileResult } from '@/modules/datasets/domain/dataset-profile.type';

export type DatasetProfileResponse = {
  result: DatasetProfileResult | null;
};
