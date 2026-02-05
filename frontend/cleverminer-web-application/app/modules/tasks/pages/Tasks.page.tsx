import { DataTable } from '@/shared/components/organisms/table/data-table';
import { columns } from '@/modules/tasks/components/organisms/table/columns';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '@/modules/tasks/api/tasks.api';
import { useNavigate } from 'react-router';
import { LoadingStatus } from '@/shared/components/molecules';

export default function TasksPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });
  if (isLoading) return <LoadingStatus />;
  if (!data) return <div>No tasks found</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tasks Overview</h1>
        <p className="text-muted-foreground">View all defined tasks.</p>
      </div>
      <DataTable
        columns={columns}
        data={data}
        showSearch={true}
        onRowClick={(row) => navigate('/tasks/' + row.id)}
      />
    </div>
  );
}
