import { Accordion, AccordionItem } from '@/shared/components/ui/molecules/accordion';
import { TasksForList } from '@/modules/projects/components/molecules';
import type { Task } from '@/modules/tasks/domain/task.type';
import { PlatformCard } from '@/shared/components/molecules';

type ProjectTasksTabProps = {
  tasks: Task[];
};

export default function ProjectTasksTab({ tasks }: ProjectTasksTabProps) {
  if (!tasks.length) return <div>No tasks found</div>;
  return (
    <PlatformCard cardTitle={'Project Tasks'} cardDescription={'Explore project tasks.'}>
      <Accordion type="single" collapsible className="w-full space-y-3">
        {tasks.map((task) => (
          <AccordionItem key={task.id} value={String(task.id)} className="border-0">
            <TasksForList task={task} />
          </AccordionItem>
        ))}
      </Accordion>
    </PlatformCard>
  );
}
