import type { ColumnDef } from '@tanstack/react-table';
import type { Task } from '@/modules/tasks/domain/task.type';
import { Button } from '@/shared/components/ui/atoms/button';
import { ArrowUpDown } from 'lucide-react';
import { formatDate } from '@/shared/utils/formatDate';

export const columns: ColumnDef<Task>[] = [
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
];
