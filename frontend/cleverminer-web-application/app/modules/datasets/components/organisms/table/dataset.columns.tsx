import type { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/shared/utils/formatDate';
import { DatasetSourceTypeBadge } from '@/modules/datasets/components/atoms/DatasetSourceTypeBadge';
import type { DatasetNode } from '@/modules/datasets/pages/Datasets.page';
import { ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BaseBooleanStatusBadge } from '@/shared/components/atoms';
import { Button } from '@/shared/components/ui/atoms/button';

export const getDatasetColumns = (onDelete: (id: number) => void): ColumnDef<DatasetNode>[] => [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            row.getToggleExpandedHandler()();
          }}
          className="flex items-center justify-center rounded p-1 transition-colors hover:bg-slate-200"
        >
          <ChevronRight
            className={cn(
              'h-5 w-5 text-slate-500 transition-transform duration-300',
              row.getIsExpanded() && 'rotate-90',
            )}
          />
        </button>
      ) : (
        <span className="block w-6" />
      ),
  },
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
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === undefined) return true;
      return row.getValue(columnId) === filterValue;
    },
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
