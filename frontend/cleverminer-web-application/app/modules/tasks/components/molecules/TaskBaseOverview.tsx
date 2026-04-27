import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import { Calculator } from 'lucide-react';
import type { Task } from '@/modules/tasks/domain/task.type';
import { ProcedureBadge } from '@/shared/components/atoms/ProcedureBadge';
import { Link } from 'react-router';

type TaskBaseOverviewProps = {
  task: Task;
};

export default function TaskBaseOverview({ task }: TaskBaseOverviewProps) {
  console.log(task);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="text-muted-foreground h-4 w-4" />
          <CardTitle className="text-base">Task Overview</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div
            key={'task_dataset'}
            className="border-primary/20 flex flex-col border-l-2 py-1 pl-3"
          >
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Dataset
            </span>
            <span className="font-mono text-lg font-semibold">
              <Link
                to={`/datasets/${task.dataset}`}
                className="block max-w-[400px] truncate font-mono text-lg font-semibold text-blue-700 hover:underline"
                title={task.dataset_name}
              >
                {task.dataset_name}
              </Link>
            </span>
          </div>
          <div key={'task_task'} className="border-primary/20 flex flex-col border-l-2 py-1 pl-3">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Task
            </span>
            <span className="font-mono text-lg font-semibold text-slate-800">
              <Link
                to={`/tasks/${task.id}`}
                className="block max-w-[400px] truncate font-mono text-lg font-semibold text-blue-700 hover:underline"
                title={task.name}
              >
                {task.name}
              </Link>
            </span>
          </div>
          <div
            key={'task_procedure'}
            className="border-primary/20 flex flex-col border-l-2 py-1 pl-3"
          >
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Procedure
            </span>
            <span className="font-mono text-lg font-semibold text-slate-800">
              <ProcedureBadge procedure={task.procedure} />
            </span>
          </div>
          <div
            key={'task_project'}
            className="border-primary/20 flex flex-col border-l-2 py-1 pl-3"
          >
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Project
            </span>
            <span className="font-mono text-lg font-semibold text-slate-800">
              {task.project ? (
                <Link
                  to={`/projects/${task.project}`}
                  className="block max-w-[400px] truncate font-mono text-lg font-semibold text-blue-700 hover:underline"
                  title={task.project_name}
                >
                  {task.project_name}
                </Link>
              ) : (
                'Not part of a project.'
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
