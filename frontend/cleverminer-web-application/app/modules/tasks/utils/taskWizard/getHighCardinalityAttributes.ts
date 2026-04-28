import type { DatasetsColumnsType } from '@/modules/datasets/domain/datasetsColumns.type';

export const getHighCardinalityAttrs = (
  section: string,
  columns: DatasetsColumnsType[],
  config: Record<string, any> | undefined,
) => {
  const attrs = (config?.[section as keyof typeof config] as any)?.attributes ?? [];
  return attrs
    .map((a: any) => columns.find((col) => col.name === a.name))
    .filter((col: DatasetsColumnsType | undefined) => col && col.distinct > 100)
    .map((col: DatasetsColumnsType) => col.name);
};
