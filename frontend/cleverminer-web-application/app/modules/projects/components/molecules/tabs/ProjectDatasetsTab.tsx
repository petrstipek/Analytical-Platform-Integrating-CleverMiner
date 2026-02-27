import { UploadCloud } from 'lucide-react';
import { DatasetUploadCard } from '@/modules/datasets/components/molecules';
import type { UploadPayload } from '@/modules/datasets/domain/uploadDataset.type';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import { getDatasetBaseColumns } from '@/modules/datasets/components/organisms/table/datasetBase.columns';
import type { Dataset } from '@/modules/datasets/api/types/datasetBase.type';

type ProjectDatasetsTabProps = {
  isPending: boolean;
  onSubmit: (payload: UploadPayload) => void;
  datasets: Dataset[];
};

export default function ProjectDatasetsTab({
  isPending,
  onSubmit,
  datasets,
}: ProjectDatasetsTabProps) {
  const navigate = useNavigate();

  const DatasetBaseColumns = getDatasetBaseColumns((id) => {});

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className={'col-span-2'}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Datasets</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={DatasetBaseColumns}
            data={datasets}
            onRowClick={(row) => navigate(`/datasets/${row.id}`)}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Datasets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <UploadCloud className="h-5 w-5" /> Import Dataset
            </h3>
            <DatasetUploadCard isPending={isPending} onSubmit={onSubmit} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
