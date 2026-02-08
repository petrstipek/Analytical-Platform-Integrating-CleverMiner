import { RUN_STATUS_STYLES } from '@/shared/components/styles/runsStatus-styling';
import type { RunResultStatus } from '@/modules/runs/domain/runs-results.type';
import { StatusBadge } from '@/shared/components/atoms/StatusBadge';

const RUN_STATUS_LABELS: Record<RunResultStatus, string> = {
  queued: 'Queued',
  running: 'Running',
  done: 'Done',
  failed: 'Failed',
  canceled: 'Canceled',
};

export function RunStatusBadge({ status }: { status: RunResultStatus }) {
  return (
    <StatusBadge
      value={status}
      styles={RUN_STATUS_STYLES}
      labels={RUN_STATUS_LABELS}
      minWidth="min-w-[80px]"
    />
  );
}
