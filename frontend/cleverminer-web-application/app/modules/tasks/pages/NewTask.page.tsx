import CreateTaskWizard from '@/modules/tasks/components/organisms/CreateTaskWizard';
import { useQuery } from '@tanstack/react-query';
import { getDatasets } from '@/modules/tasks/api/tasks.api';
import { useSearchParams } from 'react-router';

export default function TaskPage() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project_id');
  const { data: datasets, isLoading: datasetsLoading } = useQuery({
    queryKey: ['tasks-datasets'],
    queryFn: getDatasets,
  });

  return (
    <CreateTaskWizard datasets={datasets} datasetsLoading={datasetsLoading} projectId={projectId} />
  );
}
