import { useQuery } from '@tanstack/react-query';
import { getRuns, getRunsSummary } from '@/modules/runs/api/runs.api';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { RunsColumnsSummarized } from '@/modules/runs/components/organisms/table/runs.columns';
import { useNavigate } from 'react-router';
import BaseSummaryCard from '@/shared/components/atoms/BaseSummaryCard';
import { LoadingStatus } from '@/shared/components/molecules';
import { RunResultStatus } from '@/modules/runs/domain/runs-results.type';

export default function RunsPage() {
  const navigate = useNavigate();
  const { data: runsData, isLoading: laodingRunsData } = useQuery({
    queryKey: ['runs'],
    queryFn: () => getRuns(),
  });

  const { data: runsSummaryData, isLoading: loadingRunsSummary } = useQuery({
    queryKey: ['runs-summary'],
    queryFn: () => getRunsSummary(),
  });

  if (laodingRunsData || loadingRunsSummary) return <LoadingStatus />;
  if (!runsData || !runsSummaryData) return <div>No runs found</div>;

  const runningRuns = runsData.filter((run) => run.status === RunResultStatus.Running);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Runs</h1>
        <p className="text-muted-foreground">See all runs performed on this platform.</p>
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <BaseSummaryCard
          title={'Overall Count'}
          value={runsSummaryData.total}
          variant={'default'}
        />
        <BaseSummaryCard title={'Finished Runs'} value={runsSummaryData.done} variant={'success'} />
        <BaseSummaryCard
          title={'Running Runs'}
          value={runsSummaryData.running}
          variant={'running'}
        />
      </div>
      <div className="space-y-5">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">Running Runs</h3>
        <DataTable
          columns={RunsColumnsSummarized}
          data={runningRuns}
          onRowClick={(row) => navigate(`/run/${row.id}`)}
        />
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">All Runs</h3>
        <DataTable
          columns={RunsColumnsSummarized}
          data={runsData}
          onRowClick={(row) => navigate(`/run/${row.id}`)}
        />
      </div>
    </div>
  );
}
