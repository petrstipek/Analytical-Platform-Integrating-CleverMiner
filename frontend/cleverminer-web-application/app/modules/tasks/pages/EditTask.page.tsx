import CreateTaskWizard from '@/modules/tasks/components/organisms/CreateTaskWizard';
import { useQuery } from '@tanstack/react-query';
import { getDatasets, getTask } from '@/modules/tasks/api/tasks.api';
import { Loader2 } from 'lucide-react';
import { useParams } from 'react-router';

export default function EditTaskPage() {
  const { taskId } = useParams();

  const { data: datasets, isLoading: datasetsLoading } = useQuery({
    queryKey: ['tasks-datasets'],
    queryFn: getDatasets,
  });

  const {
    data: existingTask,
    isLoading: isLoadingTask,
    error: taskError,
  } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTask(Number(taskId)),
    enabled: !!taskId,
  });

  if (taskId && isLoadingTask) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <span className="ml-2">Loading task configuration...</span>
      </div>
    );
  }

  if (taskId && !isLoadingTask && taskError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <span className="ml-2">Error loading task</span>
      </div>
    );
  }

  return (
    <CreateTaskWizard
      datasets={datasets}
      datasetsLoading={datasetsLoading}
      existingTask={existingTask}
    />
  );
}
