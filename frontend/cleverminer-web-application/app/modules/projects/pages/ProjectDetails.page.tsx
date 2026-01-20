import { Tabs, TabsContent } from '@/shared/components/ui/molecules/tabs';
import { ProjectHeader, ProjectTeamMembers } from '@/modules/projects/components/molecules/';
import { TabsNavForPages, type TabsNavItem } from '@/shared/components/molecules/TabsNavForPages';
import { TEAM } from '@/modules/projects/utils/mockData';
import { ProjectDatasetsTab, ProjectTasksTab } from '@/modules/projects/components/molecules/tabs';
import { useQuery } from '@tanstack/react-query';
import { getProject } from '@/modules/projects/api/queries/projects.queries';
import { useParams } from 'react-router';
import { getTasksForProject } from '@/modules/projects/api/queries/tasks.queries';

const projectTabs: TabsNavItem[] = [
  { value: 'tasks', label: 'Tasks' },
  { value: 'runs', label: 'Runs' },
  { value: 'datasets', label: 'Datasets' },
] as const;

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const { data: baseProjectData, isLoading: baseProjectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(Number(projectId)),
  });

  const { data: projectTasks, isLoading: projectTasksLoading } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: () => getTasksForProject(Number(projectId)),
  });

  const loading = baseProjectLoading || projectTasksLoading;
  const error = !baseProjectLoading || !baseProjectData;

  if (loading) return <div>Loading...</div>;
  if (!error) return <div>No project found</div>;

  return (
    <div className="bg-background min-h-screen space-y-8 p-6">
      <ProjectHeader project={baseProjectData!} />

      <Tabs defaultValue="tasks" className="w-full">
        <TabsNavForPages items={projectTabs} />

        <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3">
          <TabsContent value="tasks" className="m-0 space-y-4 lg:col-span-2">
            <ProjectTasksTab tasks={projectTasks!} />
          </TabsContent>

          <TabsContent value="datasets" className="m-0 space-y-6 lg:col-span-2">
            <ProjectDatasetsTab />
          </TabsContent>

          <div className="space-y-6">
            <ProjectTeamMembers members={TEAM} />
            // TODO - project stats
            {/*<ProjectStats project={baseProjectData} />*/}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
