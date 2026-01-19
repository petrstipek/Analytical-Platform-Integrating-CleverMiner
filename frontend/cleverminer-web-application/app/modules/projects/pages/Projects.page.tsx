import { useQuery } from '@tanstack/react-query';
import getBaseProjects from '@/modules/projects/api/queries/projects.queries';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { ProjectColumns } from '@/modules/projects/components/organisms/table/projects.columns';
import { useNavigate } from 'react-router';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => getBaseProjects(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!projectsData) return <div>No projects found</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Projects</h1>
        <p className="text-muted-foreground">See all created projects on this platform.</p>
      </div>
      <DataTable
        columns={ProjectColumns}
        data={projectsData}
        onRowClick={(row) => navigate(`/projects/${row.id}`)}
      />
    </div>
  );
}
