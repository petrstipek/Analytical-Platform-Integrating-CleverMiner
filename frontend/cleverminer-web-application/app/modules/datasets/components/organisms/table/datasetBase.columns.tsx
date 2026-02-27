import type { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/shared/utils/formatDate';
import { DatasetSourceTypeBadge } from '@/modules/datasets/components/atoms/DatasetSourceTypeBadge';
import type { Dataset } from '@/modules/datasets/api/types/datasetBase.type';
import { BaseBooleanStatusBadge } from '@/shared/components/atoms';
import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/atoms/button';

export const getDatasetBaseColumns = (onDelete: (id: number) => void): ColumnDef<Dataset>[] => [
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
  {
    accessorKey: 'used_in_tasks',
    header: 'Used in Task',
    cell: ({ row }) => <BaseBooleanStatusBadge status={row.original?.used_in_tasks!} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        className="text-red-500 hover:bg-red-50 hover:text-red-700"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(row.original.id);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    ),
  },
];
