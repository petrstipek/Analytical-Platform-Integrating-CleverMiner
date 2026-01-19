import type { ColumnDef } from '@tanstack/react-table';
import type { ProjectType } from '@/modules/projects/domain/project.type';

export const ProjectColumns: ColumnDef<ProjectType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  { accessorKey: 'created_at', header: 'Created At' },
  { accessorKey: 'updated_at', header: 'Updated At' },
  { accessorKey: 'members', header: 'Members Count' },
];
