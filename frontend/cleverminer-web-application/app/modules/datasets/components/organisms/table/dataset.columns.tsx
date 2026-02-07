import type { ColumnDef } from '@tanstack/react-table';
import type { Dataset } from '@/modules/datasets/api/datasets.api';
import { formatDate } from '@/shared/utils/formatDate';
import { DatasetSourceTypeBadge } from '@/modules/datasets/components/atoms/DatasetSourceTypeBadge';

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
    cell: ({ row }) => <DatasetSourceTypeBadge sourceType={row.original.source_type} />,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
];
