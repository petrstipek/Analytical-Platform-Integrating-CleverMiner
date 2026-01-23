import { DatasetSummaryCard } from '@/modules/datasets/components/atoms';

export default function DatasetDetailHeader() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <DatasetSummaryCard title="Total Rows" value={'tbd'} variant="default" />
      <DatasetSummaryCard title="Ready for Mining" value={'tbd'} variant="success" />
      <DatasetSummaryCard title="Needs Configuration" value={'tbd'} variant="warning" />
    </div>
  );
}
