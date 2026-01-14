import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { SD4ftMinerDetails, CFMinerDetails } from '../components/organisms/procedures';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Terminal } from 'lucide-react';
import { ProceduresType } from '@/shared/domain/procedures.type';
import { getTask } from '@/modules/tasks/api/tasks.api';

export default function TaskDetailPage() {
  const { taskId } = useParams();

  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTask(Number(taskId!)),
    enabled: !!taskId,
  });

  if (isLoading) return <div className="p-10 text-center">Loading task details...</div>;
  if (error || !task) return <div>Error loading task.</div>;

  const renderProcedureDetails = () => {
    switch (task.procedure) {
      case ProceduresType.SD4FTMINER:
        return <SD4ftMinerDetails params={task.params} />;
      case ProceduresType.CFMINER:
        return <CFMinerDetails params={task.params} />;
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
      <div className="animate-in fade-in duration-500">{renderProcedureDetails()}</div>
    </div>
  );
}
