import type { ColumnDef } from '@tanstack/react-table';
import type { ProjectType } from '@/modules/projects/domain/project.type';
import { formatDate } from '@/shared/utils/formatDate';

export const ProjectColumns: ColumnDef<ProjectType>[] = [
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
];
