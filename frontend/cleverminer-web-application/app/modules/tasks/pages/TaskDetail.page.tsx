import { useNavigate, useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SD4ftMinerDetails,
  CFMinerDetails,
  FourFtMinerDetails,
  UICMinerDetails,
} from '../components/organisms/procedures';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/atoms/alert';
import { Pencil, Play, Terminal } from 'lucide-react';
import { ProceduresType } from '@/shared/domain/procedures.type';
import { getRunsForTask, getTask } from '@/modules/tasks/api/tasks.api';
import { Button } from '@/shared/components/ui/atoms/button';
import { TaskRunsColumns } from '@/modules/tasks/components/organisms/table/taskRuns.columns';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { useCreateAndExecuteRunMutation } from '@/modules/tasks/hooks/tasks.hook';
import { LoadingStatus, PlatformCard } from '@/shared/components/molecules';
import { ProcedureBadge } from '@/shared/components/atoms/ProcedureBadge';
import { ActionContainer } from '@/shared/components/atoms';

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const numericId = Number(taskId);
  const isValidId = !isNaN(numericId) && numericId > 0;

  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTask(Number(taskId!)),
    enabled: isValidId,
  });

  const { data: tasksRuns, isLoading: isLoadingRuns } = useQuery({
    queryKey: ['tasksRuns', taskId],
    queryFn: () => getRunsForTask(Number(taskId)),
    enabled: isValidId,
  });

  const { mutate: createAndExecuteRun } = useCreateAndExecuteRunMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasksRuns', taskId] });
    },
  });

  if (!isValidId) return <div>Invalid Task ID</div>;
  if (isLoading) return <LoadingStatus title={'Loading task detail...'} />;
  if (error || !task) return <div>Error loading task.</div>;

  const renderProcedureDetails = () => {
    switch (task.procedure) {
      case ProceduresType.SD4FTMINER:
        return <SD4ftMinerDetails params={task.params} />;
      case ProceduresType.CFMINER:
        return <CFMinerDetails params={task.params} />;
      case ProceduresType.FOURFTMINER:
        return <FourFtMinerDetails params={task.params} />;
      case ProceduresType.UICMINER:
        return <UICMinerDetails params={task.params} />;
      default:
        return (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Unknown Procedure</AlertTitle>
            <AlertDescription>
              We don't have a specialized view for <b>{task.procedure}</b> yet.
              <pre className="mt-2 w-full overflow-x-auto rounded bg-slate-950 p-4 text-xs text-slate-50">
                {JSON.stringify(task.params, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <ActionContainer className={'flex-1 flex-row'}>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{task.name}</h1>
          <p className="text-muted-foreground">
            <span className="0 mr-2 rounded px-1 py-0.5 font-mono text-xs text-slate-600">
              <ProcedureBadge procedure={task.procedure} />
            </span>
            Analyze the task set up.x
          </p>
        </ActionContainer>

        <ActionContainer>
          <Button
            onClick={() => {
              navigate(`/tasks/edit-task/${taskId}`, { state: { initialStep: 2 } });
            }}
            className="bg-primary gap-2 text-white"
          >
            <Pencil className="h-4 w-4" />
            Edit Configuration
          </Button>
          <Button
            onClick={() => {
              createAndExecuteRun(Number(taskId));
            }}
            className="gap-2 bg-green-600 text-white hover:bg-green-700"
          >
            <Play className="h-4 w-4" />
            Run Task
          </Button>
        </ActionContainer>
      </div>
      <PlatformCard
        cardTitle={'Current Task Configuration'}
        cardDescription={'Explore the current task configuration.'}
        titleClassName={'text-2xl font-bold tracking-tight text-gray-900'}
      >
        <div className="animate-in fade-in duration-500">{renderProcedureDetails()}</div>
      </PlatformCard>
      <PlatformCard
        cardTitle={'Runs for the Task'}
        cardDescription={'Explore runs belonging to this task.'}
        titleClassName={'text-2xl font-bold tracking-tight text-gray-900'}
      >
        <p className="text-muted-foreground">
          <span className="mr-2 rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-600">
            {task.procedure}
          </span>
          Analyze the task runs.
        </p>
        <div className="mt-6">
          {isLoadingRuns ? (
            <div className="p-10 text-center">Loading task runs...</div>
          ) : (
            <DataTable
              columns={TaskRunsColumns}
              data={tasksRuns!}
              onRowClick={(row) => navigate(`/run/${row.id}`)}
            />
          )}
        </div>
      </PlatformCard>
    </div>
  );
}
