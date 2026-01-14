import { DataTable } from '@/modules/tasks/components/organisms/table/data-table';
import { columns } from '@/modules/tasks/components/organisms/table/columns';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '@/modules/tasks/api/tasks.api';

export default function TasksPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No tasks found</div>;

  return <DataTable columns={columns} data={data} />;
}
