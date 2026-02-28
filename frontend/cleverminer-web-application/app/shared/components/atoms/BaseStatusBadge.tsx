import { StatusBadge } from '@/shared/components/atoms/StatusBadge';
import { BASE_BOOLEAN_STATUS_STYLES } from '@/shared/components/styles/baseStatus.style';

type AchievedKey = 'true' | 'false';

const ACHIEVED_LABELS: Record<AchievedKey, string> = {
  true: 'Yes',
  false: 'No',
};

export default function BaseBooleanStatusBadge({ status }: { status?: boolean }) {
  if (status === undefined) return null;

  const key = String(status) as AchievedKey;

  return (
    <StatusBadge
      value={key}
      styles={BASE_BOOLEAN_STATUS_STYLES}
      labels={ACHIEVED_LABELS}
      minWidth="min-w-[60px]"
    />
  );
}
