import { Accordion, AccordionItem } from '@/shared/components/ui/molecules/accordion';
import { TasksForList } from '@/modules/projects/components/molecules';
import type { Task } from '@/modules/tasks/domain/task.type';

type ProjectTasksTabProps = {
  tasks: Task[];
};

export default function ProjectTasksTab({ tasks }: ProjectTasksTabProps) {
  if (!tasks.length) return <div>No tasks found</div>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tasks</h3>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {tasks.map((task) => (
          <AccordionItem key={task.id} value={String(task.id)} className="border-0">
            <TasksForList task={task} />
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
