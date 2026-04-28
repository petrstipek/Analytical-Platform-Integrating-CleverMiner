import { BarChart3, CheckCircle, XCircle } from 'lucide-react';
import { DataTypeIcon } from '@/modules/datasets/components/atoms';
import type { ClmCandidate } from '@/modules/datasets/api/types/clmGuidance.type';
import { cn } from '@/lib/utils';
import { Label } from '@/shared/components/ui/atoms/label';
import { Switch } from '@/shared/components/ui/atoms/switch';

type ColumnCardProps = {
  col: ClmCandidate;
  status: 'good' | 'warning' | 'bad';
  onClick?: () => void;
  className?: string;
  visible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  showVisibility?: boolean;
  categoryOrder?: string[];
};

export default function ColumnCard({
  col,
  status,
  onClick,
  className,
  visible = true,
  onVisibilityChange,
  showVisibility = false,
  categoryOrder,
}: ColumnCardProps) {
  const dtype = col.dtype || 'N/A';

  const uniqueCount = col.nunique ?? col.clm?.stats?.nunique ?? col.stats?.nunique ?? '-';
  const nullCount = col.nulls ?? col.clm?.stats?.nulls ?? col.stats?.nulls ?? '-';

  let reasons: string[] = [];
  if (col.clm?.reasons) {
    reasons = col.clm.reasons;
  } else if (col.reason) {
    reasons = [col.reason];
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'mb-2 flex flex-col rounded-lg border p-3 shadow-sm transition-all hover:bg-gray-50',
        className,
      )}
    >
      <div className="flex items-start justify-between">
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
        {showVisibility && (
          <div
            className="mr-4 flex shrink-0 flex-col items-center gap-1 self-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Switch checked={visible} onCheckedChange={onVisibilityChange} className="scale-150" />
            <Label className="text-muted-foreground text-[10px]">Visible in Analysis</Label>
          </div>
        )}
      </div>
      <div>
        {categoryOrder && categoryOrder.length > 0 && (
          <div className="mt-2 border-t pt-2">
            <p className="mb-1 text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
              CleverMiner Detected Category Order
            </p>
            <div className="flex flex-wrap gap-1">
              {categoryOrder.map((cat, i) => (
                <span
                  key={cat}
                  className="flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px]"
                >
                  <span className="text-gray-400">{i + 1}.</span>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
