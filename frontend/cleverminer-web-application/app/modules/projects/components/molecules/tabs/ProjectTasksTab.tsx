import { Accordion, AccordionItem } from '@/shared/components/ui/molecules/accordion';
import { TasksForList } from '@/modules/projects/components/molecules';
import type { Task } from '@/modules/tasks/domain/task.type';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';

type ProjectTasksTabProps = {
  tasks: Task[];
};

export default function ProjectTasksTab({ tasks }: ProjectTasksTabProps) {
  if (!tasks.length) return <div>No tasks found</div>;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {tasks.map((task) => (
            <AccordionItem key={task.id} value={String(task.id)} className="border-0">
              <TasksForList task={task} />
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
