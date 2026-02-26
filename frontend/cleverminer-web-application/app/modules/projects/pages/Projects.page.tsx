import { useQuery } from '@tanstack/react-query';
import { getBaseProjects } from '@/modules/projects/api/queries/projects.query';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { ProjectColumns } from '@/modules/projects/components/organisms/table/projects.columns';
import { Link, useNavigate } from 'react-router';
import { LoadingStatus, ModulePagesHeader, PlatformCard } from '@/shared/components/molecules';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/molecules/card';
import { Button } from '@/shared/components/ui/atoms/button';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getBaseProjects(),
  });

  if (isLoading) return <LoadingStatus />;
  if (!projectsData) return <div>No projects found</div>;

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
            columns={ProjectColumns}
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
