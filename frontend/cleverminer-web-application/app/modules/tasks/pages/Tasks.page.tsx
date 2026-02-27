import { DataTable } from '@/shared/components/organisms/table/data-table';
import { getTasksBaseColumns } from '@/modules/tasks/components/organisms/table/columns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteTask, exportTasks, getTasks, getTasksSummary } from '@/modules/tasks/api/tasks.api';
import { Link, useNavigate } from 'react-router';
import { LoadingStatus, ModulePagesHeader, PlatformCard } from '@/shared/components/molecules';
import BaseSummaryCard from '@/shared/components/atoms/BaseSummaryCard';
import { Button } from '@/shared/components/ui/atoms/button';
import { toast } from 'sonner';

export default function TasksPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onError: (error: any) => {
      toast.error('Delete failed:', error.message);
    },
    onSuccess: () => {
      toast.success('Task deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  if (isLoading || tasksSummaryLoading) return <LoadingStatus />;
  if (!data || !tasksSummaryData) return <div>No tasks found</div>;

  const TaskColumns = getTasksBaseColumns((taskId: number) => {
    deleteTaskMutation.mutate(taskId);
  });

  return (
    <div>
      <ModulePagesHeader title={'Tasks'} description={'See all defined tasks'}>
        <Link to={'/tasks/new-task'}>
          <Button>Create New Task</Button>
        </Link>
      </ModulePagesHeader>
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
        <PlatformCard
          cardTitle={'Tasks'}
          cardDescription={'Explore all the available tasks.'}
          titleClassName={'text-2xl font-bold tracking-tight text-gray-900'}
        >
          <DataTable
            columns={TaskColumns}
            data={data}
            showSearch={true}
            onRowClick={(row) => navigate('/tasks/' + row.id)}
            exportData={exportTaskMutation.mutate}
          />
        </PlatformCard>
      </div>
    </div>
  );
}
