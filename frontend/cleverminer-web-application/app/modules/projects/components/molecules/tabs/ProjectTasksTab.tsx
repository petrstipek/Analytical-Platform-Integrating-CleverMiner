import { Filter } from 'lucide-react';
import { Button } from '@/shared/components/ui/atoms/button';
import { Accordion, AccordionItem } from '@/shared/components/ui/molecules/accordion';
import { TASKS } from '@/modules/projects/utils/mockData';
import { TasksForList } from '@/modules/projects/components/molecules';

export default function ProjectTasksTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" /> Status
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {TASKS.map((task) => (
          <AccordionItem key={task.id} value={String(task.id)} className="border-0">
            <TasksForList task={task} />
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
