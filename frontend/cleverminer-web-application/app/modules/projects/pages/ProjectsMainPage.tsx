import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import {
  ProjectHeader,
  ProjectStats,
  ProjectTeamMembers,
} from '@/modules/projects/components/molecules/';
import { TabsNavForPages, type TabsNavItem } from '@/shared/components/molecules/TabsNavForPages';
import { PROJECT, TEAM } from '@/modules/projects/utils/mockData';
import { ProjectDatasetsTab, ProjectTasksTab } from '@/modules/projects/components/molecules/tabs';

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
          <TabsContent value="tasks" className="m-0 space-y-4 lg:col-span-2">
            <ProjectTasksTab />
          </TabsContent>

          <TabsContent value="datasets" className="m-0 space-y-6 lg:col-span-2">
            <ProjectDatasetsTab />
          </TabsContent>

          <div className="space-y-6">
            <ProjectTeamMembers members={TEAM} />
            <ProjectStats project={PROJECT} />
          </div>
        </div>
      </Tabs>
    </div>
  );
}
