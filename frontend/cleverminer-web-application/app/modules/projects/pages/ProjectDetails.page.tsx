import { Tabs, TabsContent } from '@/shared/components/ui/molecules/tabs';
import { ProjectHeader, ProjectTeamMembers } from '@/modules/projects/components/molecules/';
import { TabsNavForPages, type TabsNavItem } from '@/shared/components/molecules/TabsNavForPages';
import { TEAM } from '@/modules/projects/utils/mockData';
import {
  ProjectDatasetsTab,
  ProjectRunsTab,
  ProjectTasksTab,
} from '@/modules/projects/components/molecules/tabs';
import { useQuery } from '@tanstack/react-query';
import { getProject, getProjectRuns } from '@/modules/projects/api/queries/projects.query';
import { useParams } from 'react-router';
import { getTasksForProject } from '@/modules/projects/api/queries/tasks.query';
import { useUploadDatasetMutation } from '@/modules/datasets/hooks/datasets.hook';
import type { UploadPayload } from '@/modules/datasets/domain/uploadDataset.type';
import { getProjectDatasets } from '@/modules/projects/api/queries/datasets.query';
import { LoadingStatus } from '@/shared/components/molecules';

const projectTabs: TabsNavItem[] = [
  { value: 'overview', label: 'Overview' },
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

  const { data: runsData, isLoading: runsDataLoading } = useQuery({
    queryKey: ['project-runs'],
    queryFn: () => getProjectRuns(Number(projectId)),
  });

  const { data: projectDatasets, isLoading: projectDatasetsLoading } = useQuery({
    queryKey: ['project-datasets', projectId],
    queryFn: () => getProjectDatasets(Number(projectId)),
  });

  const { mutate: uploadDataset, isPending: uploadingDataset } = useUploadDatasetMutation();

  const handleDatasetUpload = (formData: Pick<UploadPayload, 'name' | 'file'>) => {
    uploadDataset({
      ...formData,
      projectId: Number(projectId),
    });
  };

  const loading =
    baseProjectLoading || projectTasksLoading || runsDataLoading || projectDatasetsLoading;
  const error = !baseProjectLoading || !baseProjectData || !runsData || !projectDatasets;

  if (loading) return <LoadingStatus />;
  if (!error) return <div>No project data found</div>;

  return (
    <div className="bg-background min-h-screen space-y-8 p-6">
      <ProjectHeader project={baseProjectData!} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsNavForPages items={projectTabs} />

        <div className="">
          <TabsContent value="overview" className="m-0">
            <div className="space-y-6">
              <ProjectTeamMembers members={TEAM} />
              {/*TODO - project stats*/}
              {/*<ProjectStats project={baseProjectData} />*/}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="m-0 space-y-4 lg:col-span-2">
            <ProjectTasksTab tasks={projectTasks!} />
          </TabsContent>

          <TabsContent value="runs" className="m-0">
            <ProjectRunsTab runs={runsData!} />
          </TabsContent>

          <TabsContent value="datasets" className="m-0 space-y-6 lg:col-span-2">
            <ProjectDatasetsTab
              isPending={uploadingDataset}
              onSubmit={handleDatasetUpload}
              datasets={projectDatasets!}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
