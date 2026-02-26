import { useMutation, useQuery } from '@tanstack/react-query';
import { exportRuns, getRuns, getRunsSummary } from '@/modules/runs/api/runs.api';
import { DataTable } from '@/shared/components/organisms/table/data-table';
import { RunsColumnsSummarized } from '@/modules/runs/components/organisms/table/runs.columns';
import { useNavigate } from 'react-router';
import BaseSummaryCard from '@/shared/components/atoms/BaseSummaryCard';
import { LoadingStatus, ModulePagesHeader, PlatformCard } from '@/shared/components/molecules';
import { RunResultStatus } from '@/modules/runs/domain/runs-results.type';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/molecules/card';
import { toast } from 'sonner';
import { ActionContainer } from '@/shared/components/atoms';

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

  const exportRunsMutation = useMutation({
    mutationFn: () => exportRuns(),
    onError: (error: any) => toast.error('Export failed:', error.message),
  });

  if (laodingRunsData || loadingRunsSummary) return <LoadingStatus />;
  if (!runsData || !runsSummaryData) return <div>No runs found</div>;

  const runningRuns = runsData.filter((run) => run.status === RunResultStatus.Running);

  return (
    <div>
      <ModulePagesHeader title={'Runs'} description={'See all runs performed on this platform.'} />
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
        {runningRuns.length > 0 && (
          <PlatformCard
            cardTitle={'Running Runs'}
            cardDescription={'Explore currently running runs.'}
            titleClassName={''}
          >
            <DataTable
              columns={RunsColumnsSummarized}
              data={runningRuns}
              onRowClick={(row) => navigate(`/run/${row.id}`)}
              showSearch={true}
              mainSearchColumn={'task_name'}
            />
          </PlatformCard>
        )}
        <PlatformCard
          cardTitle={'All runs'}
          cardDescription={'Explore all the runs available.'}
          titleClassName={'text-2xl font-bold tracking-tight text-gray-900'}
        >
          <DataTable
            columns={RunsColumnsSummarized}
            data={runsData}
            onRowClick={(row) => navigate(`/run/${row.id}`)}
            showSearch={true}
            mainSearchColumn={'task_name'}
            exportData={exportRunsMutation.mutate}
          />
        </PlatformCard>
      </div>
    </div>
  );
}
