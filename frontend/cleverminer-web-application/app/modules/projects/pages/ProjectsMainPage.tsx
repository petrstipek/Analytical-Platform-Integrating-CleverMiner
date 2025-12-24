import { Filter } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import {
  ProjectHeader,
  ProjectStats,
  ProjectTeamMembers,
  TasksForList,
} from '@/modules/projects/components/molecules/';
import { TabsNavForPages, type TabsNavItem } from '@/shared/components/molecules/TabsNavForPages';
import { Accordion, AccordionItem } from '@/shared/components/ui/accordion';
import { PROJECT, TASKS, TEAM } from '@/modules/projects/utils/mockData';

const projectTabs: TabsNavItem[] = [
  { value: 'tasks', label: 'Tasks' },
  { value: 'runs', label: 'Runs' },
  { value: 'datasets', label: 'Datasets' },
] as const;

export default function ProjectDetailsPage() {
  return (
    <div className="bg-background min-h-screen space-y-8 p-6">
      <ProjectHeader project={PROJECT} />

      <Tabs defaultValue="tasks" className="w-full">
        <TabsNavForPages items={projectTabs} />

        <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
          {/* left column */}
          <TabsContent value="tasks" className="m-0 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Tasks</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Status
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Accordion type="single" collapsible className="w-full space-y-3">
                {TASKS.map((task) => (
                  <AccordionItem key={task.id} value={String(task.id)} className="border-0">
                    <TasksForList task={task} />
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </TabsContent>

          {/* right column */}
          <div className="space-y-6">
            <ProjectTeamMembers members={TEAM} />
            <ProjectStats project={PROJECT} />
          </div>
        </div>
      </Tabs>
    </div>
  );
}
