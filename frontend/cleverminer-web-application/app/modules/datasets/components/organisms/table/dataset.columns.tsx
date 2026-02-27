import type { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/shared/utils/formatDate';
import { DatasetSourceTypeBadge } from '@/modules/datasets/components/atoms/DatasetSourceTypeBadge';
import type { DatasetNode } from '@/modules/datasets/pages/Datasets.page';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BaseBooleanStatusBadge } from '@/shared/components/atoms';

export const DatasetColumns: ColumnDef<DatasetNode>[] = [
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
];
