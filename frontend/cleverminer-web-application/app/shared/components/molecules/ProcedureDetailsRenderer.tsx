import {
  CFMinerDetails,
  FourFtMinerDetails,
  SD4ftMinerDetails,
  UICMinerDetails,
} from '@/modules/tasks/components/organisms/procedures';
import { ProceduresType } from '@/shared/domain/procedures.type';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/atoms/alert';
import { Terminal } from 'lucide-react';
import type { Task } from '@/modules/tasks/domain/task.type';

export const renderProcedureDetails = (task: Task) => {
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
            Procedure renderer failed.
            <pre className="mt-2 w-full overflow-x-auto rounded bg-slate-950 p-4 text-xs text-slate-50">
              {JSON.stringify(task.params, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      );
  }
};
