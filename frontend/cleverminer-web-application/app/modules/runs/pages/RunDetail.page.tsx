import RunResultsView from '@/modules/runs/components/organisms/RunResultsView';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getRun } from '@/modules/runs/api/runs.api';
import { LoadingStatus } from '@/shared/components/molecules';

export default function RunDetail() {
  const { runId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['run', runId],
    queryFn: () => getRun(Number(runId!)),
  });

  if (isLoading) return <LoadingStatus />;
  if (!data) return <div>No run found</div>;

  return <RunResultsView runResult={data} />;
}
