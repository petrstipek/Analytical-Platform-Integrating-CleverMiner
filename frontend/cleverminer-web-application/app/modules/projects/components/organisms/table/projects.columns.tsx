import type { ColumnDef } from '@tanstack/react-table';
import type { ProjectType } from '@/modules/projects/domain/project.type';
import { formatDate } from '@/shared/utils/formatDate';
import { Button } from '@/shared/components/ui/atoms/button';
import { Trash2 } from 'lucide-react';

export const getBaseProjectColumns = (onDelete: (id: number) => void): ColumnDef<ProjectType>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
  { accessorKey: 'members', header: 'Members Count' },
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
