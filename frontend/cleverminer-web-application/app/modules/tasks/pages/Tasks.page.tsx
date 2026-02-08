import { DataTable } from '@/shared/components/organisms/table/data-table';
import { columns } from '@/modules/tasks/components/organisms/table/columns';
import { useMutation, useQuery } from '@tanstack/react-query';
import { exportTasks, getTasks, getTasksSummary } from '@/modules/tasks/api/tasks.api';
import { Link, useNavigate } from 'react-router';
import { LoadingStatus } from '@/shared/components/molecules';
import BaseSummaryCard from '@/shared/components/atoms/BaseSummaryCard';
import { Button } from '@/shared/components/ui/atoms/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/molecules/card';
import { toast } from 'sonner';

export default function TasksPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const { data: tasksSummaryData, isLoading: tasksSummaryLoading } = useQuery({
    queryKey: ['tasks-summary'],
    queryFn: () => getTasksSummary(),
  });

  const exportTaskMutation = useMutation({
    mutationFn: () => exportTasks(),
    onError: (error: any) => {
      toast.error('Export failed:', error.message);
    },
  });

  if (isLoading || tasksSummaryLoading) return <LoadingStatus />;
  if (!data || !tasksSummaryData) return <div>No tasks found</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tasks Overview</h1>
          <p className="text-muted-foreground">View all defined tasks.</p>
        </div>
        <Link to={'/tasks/new-task'}>
          <Button>Create New Task</Button>
        </Link>
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <BaseSummaryCard
          title={'Overall Count'}
          value={tasksSummaryData.total}
          variant={'default'}
        />
        <BaseSummaryCard
          title={'Finished Runs'}
          value={tasksSummaryData.done}
          variant={'success'}
        />
        <BaseSummaryCard
          title={'Queued Tasks'}
          value={tasksSummaryData.queued}
          variant={'running'}
        />
      </div>
      <div className="space-y-5">
        <Card className="bg-background/80 rounded-2xl border shadow-sm ring-1 ring-black/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">Tasks</CardTitle>
            <CardDescription>Explore all the tasks available.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={data}
              showSearch={true}
              onRowClick={(row) => navigate('/tasks/' + row.id)}
              exportData={exportTaskMutation.mutate}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
