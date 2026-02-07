import { RUN_ACHIEVED_RESULT_STYLES } from '@/shared/components/styles/runsStatus-styling';
import { StatusBadge } from '@/shared/components/atoms/StatusBadge';

type AchievedKey = 'true' | 'false';

const ACHIEVED_LABELS: Record<AchievedKey, string> = {
  true: 'Yes',
  false: 'No',
};

export function RunAchievedResultBadge({ status }: { status?: boolean }) {
  if (status === undefined) return null;

  const key = String(status) as AchievedKey;

  return (
    <StatusBadge
      value={key}
      styles={RUN_ACHIEVED_RESULT_STYLES}
      labels={ACHIEVED_LABELS}
      minWidth="min-w-[60px]"
    />
  );
}
