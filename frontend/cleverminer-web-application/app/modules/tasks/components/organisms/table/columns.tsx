import type { ColumnDef } from '@tanstack/react-table';
import type { Task } from '@/modules/tasks/domain/task.type';
import { Button } from '@/shared/components/ui/atoms/button';
import { ArrowUpDown, Trash2 } from 'lucide-react';
import { formatDate } from '@/shared/utils/formatDate';
import { PROCEDURE_STYLES } from '@/shared/components/styles/procedures-styling';

export const getTasksBaseColumns = (onDelete: (id: number) => void): ColumnDef<Task>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'dataset_name',
    header: 'Dataset',
  },
  {
    accessorKey: 'procedure',
    header: 'Procedure',
    cell: ({ getValue }) => {
      const procedure = getValue<Task['procedure']>();
      const styles = PROCEDURE_STYLES[procedure];

      return (
        <span
          className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${styles.bg} ${styles.text}`}
        >
          {procedure}
        </span>
      );
    },
  },
  {
    accessorKey: 'created_at',
    cell: ({ getValue }) => formatDate(getValue<string>()),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
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
          e.stopPropagation(); // prevent row click from firing
          onDelete(row.original.id);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    ),
  },
];
