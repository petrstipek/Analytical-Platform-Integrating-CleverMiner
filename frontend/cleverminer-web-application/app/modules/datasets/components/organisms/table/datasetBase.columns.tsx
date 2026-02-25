import type { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/shared/utils/formatDate';
import { DatasetSourceTypeBadge } from '@/modules/datasets/components/atoms/DatasetSourceTypeBadge';
import type { Dataset } from '@/modules/datasets/api/types/datasetBase.type';

export const DatasetBaseColumns: ColumnDef<Dataset>[] = [
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
