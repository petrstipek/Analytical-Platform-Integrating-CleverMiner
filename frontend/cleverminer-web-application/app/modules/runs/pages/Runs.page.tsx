import { useQuery } from '@tanstack/react-query';
import { getRuns } from '@/modules/runs/api/runs.api';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { RunsColumns } from '@/modules/runs/components/organisms/table/runs.columns';

export default function RunsPage() {
  const { data: runsData, isLoading: laodingRunsData } = useQuery({
    queryKey: ['runs'],
    queryFn: () => getRuns(),
  });

  if (laodingRunsData) return <div>Loading...</div>;
  if (!runsData) return <div>No runs found</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Runs</h1>
        <p className="text-muted-foreground">See all runs performed on this platform.</p>
      </div>
      <DataTable columns={RunsColumns} data={runsData} />
    </div>
  );
}
