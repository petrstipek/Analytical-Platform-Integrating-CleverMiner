import { Card, CardContent } from '@/shared/components/ui/molecules/card';
import { AccordionContent, AccordionTrigger } from '@/shared/components/ui/molecules/accordion';
import { Badge } from '@/shared/components/ui/atoms/badge';
import { cn } from '@/lib/utils';
import type { TaskType } from '@/modules/projects/domain/task.type';
import { TASK_STATUS_BADGE_CLASS } from '@/shared/components/utils/uiStatus';

type TasksForListProps = {
  task: TaskType;
};

export default function TasksForList({ task }: TasksForListProps) {
  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardContent className="p-4">
        <AccordionTrigger className="p-0 hover:no-underline">
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex-1 space-y-1 text-left">
              <div className="font-medium">{task.title}</div>
              <p className="text-muted-foreground line-clamp-1 text-sm">{task.description}</p>
              <div className="flex items-center gap-3 pt-2">
                <Badge
                  variant="outline"
                  className={cn('border-0', TASK_STATUS_BADGE_CLASS[task.status])}
                >
                  {task.status}
                </Badge>
              </div>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="pt-4">
          <div className="text-muted-foreground text-sm">
            Expanded task details here with buttons to run the task or update it…
          </div>
        </AccordionContent>
      </CardContent>
    </Card>
  );
}
