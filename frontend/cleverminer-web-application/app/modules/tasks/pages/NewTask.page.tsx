import CreateTaskWizard from '@/modules/tasks/components/organisms/CreateTaskWizard';
import { useQuery } from '@tanstack/react-query';
import { getDatasets, getDatasetsColumns } from '@/modules/tasks/api/tasks.api';

export default function TaskPage() {
  const { data: datasets, isLoading: datasetsLoading } = useQuery({
    queryKey: ['tasks-datasets'],
    queryFn: getDatasets,
  });

  return <CreateTaskWizard datasets={datasets} datasetsLoading={datasetsLoading} />;
}
