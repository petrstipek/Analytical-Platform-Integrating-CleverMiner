import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBaseProjects } from '@/modules/projects/api/queries/projects.query';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { Link, useNavigate } from 'react-router';
import { LoadingStatus, ModulePagesHeader, PlatformCard } from '@/shared/components/molecules';
import { Button } from '@/shared/components/ui/atoms/button';
import { deleteProject } from '@/modules/projects/api/mutatations/projects.mutations';
import { toast } from 'sonner';
import { getBaseProjectColumns } from '@/modules/projects/components/organisms/table/projects.columns';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getBaseProjects(),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: number) => deleteProject(projectId),
    onSuccess: () => {
      toast.success('Project deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: any) => {
      toast.error('Delete failed:', error.message);
    },
  });

  if (isLoading) return <LoadingStatus />;
  if (!projectsData) return <div>No projects found</div>;

  const ProjectBaseColumns = getBaseProjectColumns((projectId: number) => {
    deleteProjectMutation.mutate(projectId);
  });

  return (
    <div>
      <ModulePagesHeader title={'Projects'} description={'See all created projects.'}>
        <Link to={'/projects/new-project'}>
          <Button>Create New Project</Button>
        </Link>
      </ModulePagesHeader>
      <div className="space-y-5">
        <PlatformCard
          cardTitle={'Projects'}
          cardDescription={'Explore your projects.'}
          titleClassName={'text-2xl font-bold tracking-tight text-gray-900'}
        >
          <DataTable
            columns={ProjectBaseColumns}
            data={projectsData}
            onRowClick={(row) => navigate(`/projects/${row.id}`)}
            showSearch={true}
            mainSearchColumn={'name'}
          />
        </PlatformCard>
      </div>
    </div>
  );
}
