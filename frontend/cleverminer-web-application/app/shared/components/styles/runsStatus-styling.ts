import { RunAchievedResult } from '@/shared/domain/runStatus.type';
import type { RunResultStatus } from '@/modules/runs/domain/runs-results.type';

export const RUN_STATUS_STYLES: Record<
  RunResultStatus,
  { bg: string; text: string; ring?: string }
> = {
  queued: { bg: 'bg-slate-100', text: 'text-slate-700', ring: 'ring-slate-200' },
  running: { bg: 'bg-blue-100', text: 'text-blue-800', ring: 'ring-blue-200' },
  done: { bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-200' },
  failed: { bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-200' },
  canceled: { bg: 'bg-zinc-100', text: 'text-zinc-700', ring: 'ring-zinc-200' },
};

export const RUN_ACHIEVED_RESULT_STYLES: Record<
  RunAchievedResult,
  { bg: string; text: string; ring?: string }
> = {
  true: { bg: 'bg-green-300', text: 'text-green-800', ring: 'ring-green-400' },
  false: { bg: 'bg-red-300', text: 'text-red-800', ring: 'ring-red-400' },
};
