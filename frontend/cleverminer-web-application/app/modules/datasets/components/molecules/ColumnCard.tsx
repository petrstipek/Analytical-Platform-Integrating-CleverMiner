import { Badge, BarChart3, CheckCircle, XCircle } from 'lucide-react';
import { DataTypeIcon } from '@/modules/datasets/components/atoms';
import type { ClmCandidate } from '@/modules/datasets/api/types/clmGuidance.type';

export default function ColumnCard({
  col,
  status,
}: {
  col: ClmCandidate;
  status: 'good' | 'warning' | 'bad';
}) {
  const dtype = col.dtype || 'N/A';

  const uniqueCount = col.nunique ?? col.clm?.stats?.nunique ?? col.stats?.nunique ?? '-';
  const nullCount = col.nulls ?? col.clm?.stats?.nulls ?? col.stats?.nulls ?? '-';

  let reasons: string[] = [];
  if (col.clm?.reasons) {
    reasons = col.clm.reasons;
  } else if (col.reason) {
    reasons = [col.reason];
  }

  const badgeText =
    col.clm?.recommended_representation || (status === 'bad' ? 'ignored' : 'unknown');

  return (
    <div className="mb-2 flex items-start justify-between rounded-lg border bg-white p-3 shadow-sm transition-all hover:bg-gray-50">
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 rounded p-1 ${
            status === 'good'
              ? 'bg-green-100'
              : status === 'warning'
                ? 'bg-amber-100'
                : 'bg-gray-100'
          }`}
        >
          {status === 'good' && <CheckCircle className="h-4 w-4 text-green-700" />}
          {status === 'warning' && <BarChart3 className="h-4 w-4 text-amber-700" />}
          {status === 'bad' && <XCircle className="h-4 w-4 text-gray-500" />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{col.name}</span>
            <DataTypeIcon type={col.dtype} />
            <span className="text-muted-foreground rounded border px-1 text-[10px] uppercase">
              {dtype}
            </span>
          </div>

          <div className="text-muted-foreground mt-1 flex gap-3 text-xs">
            <span>
              Unique: <strong className="text-gray-700">{uniqueCount}</strong>
            </span>
            <span>
              Nulls: <strong className="text-gray-700">{nullCount}</strong>
            </span>
          </div>

          {reasons.length > 0 && (
            <div className="mt-2 rounded border border-gray-100 bg-gray-100/80 p-1.5 text-xs text-gray-600">
              {reasons[0]}
              {reasons.length > 1 && (
                <span className="ml-1 font-medium text-gray-400">(+{reasons.length - 1})</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-right">
        <Badge
          className={
            status === 'good'
              ? 'bg-green-600 hover:bg-green-700'
              : status === 'warning'
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-gray-400 hover:bg-gray-500'
          }
        >
          {badgeText}
        </Badge>
      </div>
    </div>
  );
}
