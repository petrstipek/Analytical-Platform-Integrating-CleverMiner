import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteDataset, exportDatasets, getDatasets } from '@/modules/datasets/api/datasets.api';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { getDatasetColumns } from '@/modules/datasets/components/organisms/table/dataset.columns';
import { Link, useNavigate } from 'react-router';
import { LoadingStatus, ModulePagesHeader, PlatformCard } from '@/shared/components/molecules';
import { Button } from '@/shared/components/ui/atoms/button';
import type { Dataset } from '@/modules/datasets/api/types/datasetBase.type';
import { getDatasetBaseColumns } from '@/modules/datasets/components/organisms/table/datasetBase.columns';
import { toast } from 'sonner';

export type DatasetNode = Dataset & { children: DatasetNode[] };

export default function DatasetsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['datasets'],
    queryFn: () => getDatasets(),
  });

  const exportDatasetsMutation = useMutation({
    mutationFn: () => exportDatasets(),
    onError: (error: any) => {
      toast.error('Export failed:', error.message);
    },
  });

  const deleteDatasetMutation = useMutation({
    mutationFn: (id: number) => deleteDataset(id),
    onError: (error: any) => {
      toast.error('Delete failed:', error.message);
    },
    onSuccess: () => {
      toast.success('Dataset deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
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

  const DatasetColumns = getDatasetColumns((id) => {
    deleteDatasetMutation.mutate(id);
  });

  const DatasetBaseColumns = getDatasetBaseColumns((id) => {
    deleteDatasetMutation.mutate(id);
  });

  return (
    <div>
      <ModulePagesHeader title={'Datasets'} description={'See all uploaded datasets'}>
        <Link to={'/datasets/upload'}>
          <Button>Upload New Dataset</Button>
        </Link>
      </ModulePagesHeader>
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
            showBooleanFilter={true}
            booleanFilterColumn={'used_in_tasks'}
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
            exportData={exportDatasetsMutation.mutate}
            showBooleanFilter={true}
            booleanFilterColumn={'used_in_tasks'}
          />
        </PlatformCard>
      </div>
    </div>
  );
}
