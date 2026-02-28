import type { BooleanStatusType } from '@/shared/domain/booleanStatus.type';

export const BASE_BOOLEAN_STATUS_STYLES: Record<
  BooleanStatusType,
  { bg: string; text: string; ring?: string }
> = {
  true: { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-200' },
  false: { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-200' },
};
