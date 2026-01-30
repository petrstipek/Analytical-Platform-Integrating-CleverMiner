import { useQuery } from '@tanstack/react-query';
import { getDatasets } from '@/modules/datasets/api/datasets.api';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { DatasetColumns } from '@/modules/datasets/components/organisms/table/dataset.columns';
import { Link, useNavigate } from 'react-router';
import { LoadingStatus } from '@/shared/components/molecules';
import { Button } from '@/shared/components/ui/atoms/button';

export default function DatasetsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['datasets'],
    queryFn: () => getDatasets(),
  });

  if (isLoading) return <LoadingStatus />;
  if (!data) return <div>No datasets found</div>;

  const generatedDatasets = data.filter((dataset) => dataset.source_type === 'generated');

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Datasets</h1>
          <p className="text-muted-foreground">See all uploaded datasets.</p>
        </div>
        <Link to={'/datasets/upload'}>
          <Button>Upload New Dataset</Button>
        </Link>
      </div>
      <div className="space-y-5">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">Pre-processed Datasets</h3>
        <DataTable
          columns={DatasetColumns}
          data={generatedDatasets}
          onRowClick={(row) => navigate(`/datasets/${row.id}`)}
        />
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">All Datasets</h3>
        <DataTable
          columns={DatasetColumns}
          data={data}
          onRowClick={(row) => navigate(`/datasets/${row.id}`)}
        />
      </div>
    </div>
  );
}
