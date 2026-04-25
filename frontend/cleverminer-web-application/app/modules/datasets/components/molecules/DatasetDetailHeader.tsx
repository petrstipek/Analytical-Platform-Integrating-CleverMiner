import { DatasetSummaryCard } from '@/modules/datasets/components/atoms';
import type { DatasetStatsOverview } from '@/modules/datasets/api/types/datasetStatsOverview.type';
import { ModulePagesHeader } from '@/shared/components/molecules';
import { Button } from '@/shared/components/ui/atoms/button';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router';

type DatasetDetailHeaderProps = {
  datasetStatsOverview: DatasetStatsOverview;
  datasetId: number;
};

export default function DatasetDetailHeader({
  datasetStatsOverview,
  datasetId,
}: DatasetDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <div>
      <ModulePagesHeader
        title={datasetStatsOverview.dataset_name}
        description={'Explore the selected dataset.'}
      >
        <DialogTrigger asChild>
          <Button>Explore Dataset Transformations</Button>
        </DialogTrigger>
        <Button
          variant="secondary"
          onClick={() => navigate(`/tasks/new-task?dataset=${datasetId}`)}
        >
          Use this dataset in analysis
        </Button>
      </ModulePagesHeader>
      <div className="grid gap-4 md:grid-cols-3">
        <DatasetSummaryCard
          title="Total Rows"
          value={datasetStatsOverview.row_count}
          variant="default"
        />
        <DatasetSummaryCard
          title="Total columns"
          value={datasetStatsOverview.total_columns}
          variant="info"
        />
        <DatasetSummaryCard
          title="Number of columns that need configuration"
          value={datasetStatsOverview.not_usable_as_is}
          variant="warning"
        />
      </div>
    </div>
  );
}
