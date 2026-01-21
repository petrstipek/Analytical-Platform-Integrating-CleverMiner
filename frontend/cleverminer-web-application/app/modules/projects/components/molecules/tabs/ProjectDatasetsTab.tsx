import { Database, FileText, Plus, UploadCloud } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/molecules/card';
import { Button } from '@/shared/components/ui/atoms/button';
import { DatasetUploadCard } from '@/modules/datasets/components/molecules';
import type { UploadPayload } from '@/modules/datasets/domain/uploadDataset.type';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { useNavigate } from 'react-router';
import { DatasetColumns } from '@/modules/datasets/components/organisms/table/dataset.columns';
import type { Dataset } from '@/modules/datasets/api/datasets.api';

const MOCK_DATASETS = [
  { id: 1, name: 'Q1_Customer_Data.csv', size: '2.4 MB', uploaded: '2 mins ago' },
  { id: 2, name: 'Training_Set_V2.json', size: '145 KB', uploaded: '1 hour ago' },
  { id: 3, name: 'Legacy_Import_2024.xml', size: '12 MB', uploaded: 'Yesterday' },
];

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
  return (
    <>
      <div className="space-y-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <UploadCloud className="h-5 w-5" /> Import Dataset
        </h3>
        <DatasetUploadCard isPending={isPending} onSubmit={onSubmit} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Database className="h-5 w-5" /> Existing Datasets
          </h3>
          <Button variant="ghost" size="sm" className="h-8">
            View All
          </Button>
        </div>
        <DataTable
          columns={DatasetColumns}
          data={datasets}
          onRowClick={(row) => navigate(`/datasets/${row.id}`)}
        />
      </div>
    </>
  );
}
