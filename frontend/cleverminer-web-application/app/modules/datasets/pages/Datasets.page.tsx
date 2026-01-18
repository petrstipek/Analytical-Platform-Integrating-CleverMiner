import { useQuery } from '@tanstack/react-query';
import { getDatasets } from '@/modules/datasets/api/datasets.api';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { DatasetColumns } from '@/modules/datasets/components/organisms/table/dataset.columns';

export default function DatasetsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['datasets'],
    queryFn: () => getDatasets(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No datasets found</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Datasets</h1>
        <p className="text-muted-foreground">See all uploaded datasets.</p>
      </div>
      <DataTable columns={DatasetColumns} data={data} />{' '}
    </div>
  );
}
