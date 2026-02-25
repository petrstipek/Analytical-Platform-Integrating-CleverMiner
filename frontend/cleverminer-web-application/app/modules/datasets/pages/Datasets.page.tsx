import { useQuery } from '@tanstack/react-query';
import { getDatasets } from '@/modules/datasets/api/datasets.api';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { DatasetColumns } from '@/modules/datasets/components/organisms/table/dataset.columns';
import { Link, useNavigate } from 'react-router';
import { LoadingStatus, PlatformCard } from '@/shared/components/molecules';
import { Button } from '@/shared/components/ui/atoms/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/molecules/card';
import type { Dataset } from '@/modules/datasets/api/types/datasetBase.type';
import { DatasetBaseColumns } from '@/modules/datasets/components/organisms/table/datasetBase.columns';

export type DatasetNode = Dataset & { children: DatasetNode[] };

export default function DatasetsPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['datasets'],
    queryFn: () => getDatasets(),
  });

  if (isLoading) return <LoadingStatus />;
  if (!data) return <div>No datasets found</div>;

  const generatedDatasets = data.filter((dataset) => dataset.source_type === 'generated');

  type DatasetNode = Dataset & { children: DatasetNode[] };

  function buildTree(datasets: Dataset[]): DatasetNode[] {
    const map: Record<number, DatasetNode> = Object.fromEntries(
      datasets.map((d) => [d.id, { ...d, children: [] }]),
    );

    return datasets.reduce<DatasetNode[]>((roots, d) => {
      if (d.parent_id) map[d.parent_id]?.children.push(map[d.id]);
      else roots.push(map[d.id]);
      return roots;
    }, []);
  }

  const treeData = buildTree(data);

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
        <PlatformCard
          cardTitle={'Pre-processed datasets'}
          cardDescription={'Explore pre-processed datasets.'}
        >
          <DataTable
            columns={DatasetBaseColumns}
            data={generatedDatasets}
            onRowClick={(row) => navigate(`/datasets/${row.id}`)}
            showSearch={true}
            mainSearchColumn={'name'}
          />
        </PlatformCard>
        <PlatformCard
          cardTitle={'All Datasets'}
          cardDescription={'Explore all the available datasets.'}
        >
          <DataTable
            columns={DatasetColumns}
            data={treeData}
            getSubRows={(row) => row.children}
            onRowClick={(row) => navigate(`/datasets/${row.id}`)}
            showSearch={true}
            mainSearchColumn={'name'}
          />
        </PlatformCard>
      </div>
    </div>
  );
}
