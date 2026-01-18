import type { ColumnDef } from '@tanstack/react-table';
import type { Dataset } from '@/modules/datasets/api/datasets.api';

export const DatasetColumns: ColumnDef<Dataset>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'source_type',
    header: 'Source Type',
  },
  { accessorKey: 'created_at', header: 'Created At' },
];
