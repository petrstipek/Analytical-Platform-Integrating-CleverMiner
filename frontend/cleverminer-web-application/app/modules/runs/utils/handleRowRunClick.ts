import { type RunResult, RunResultStatus } from '@/modules/runs/domain/runs-results.type';
import { toast } from 'sonner';
import type { NavigateFunction } from 'react-router';

export const handleRunClick = (row: RunResult, navigate: NavigateFunction) => {
  if (row.status === RunResultStatus.Queued || row.status === RunResultStatus.Running) {
    toast.info('Run is still in progress. Results will be available once it completes.');
    return;
  } else if (row.status === RunResultStatus.Failed) {
    toast.error('Run failed.');
    return;
  } else if (row.status === RunResultStatus.Canceled) {
    toast.warning('Run was canceled.');
    return;
  }
  navigate(`/runs/${row.id}`);
};
