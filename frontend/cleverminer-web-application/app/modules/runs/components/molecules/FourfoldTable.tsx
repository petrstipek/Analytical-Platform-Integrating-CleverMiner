import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/molecules/card';
import { cn } from '@/lib/utils';

interface FourfoldTableProps {
  data: number[];
}

export default function FourfoldTable({ data }: FourfoldTableProps) {
  const [a, b, c, d] = data;
  const total = a + b + c + d;

  const getIntensity = (val: number) => Math.max(0.05, val / total);

  const getTextColor = (val: number) => {
    return getIntensity(val) > 0.5 ? 'text-white' : 'text-slate-700';
  };

  const getSubTextColor = (val: number) => {
    return getIntensity(val) > 0.5 ? 'text-white/70' : 'text-slate-400';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm font-medium">
          Contingency Table
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-md border text-center text-sm">
          <div className="bg-slate-100 p-2 text-xs font-semibold text-slate-500"></div>
          <div className="bg-slate-100 p-2 text-xs font-semibold text-slate-500">Succedent</div>
          <div className="bg-slate-100 p-2 text-xs font-semibold text-slate-500">No Succedent</div>

          <div className="flex items-center justify-center bg-slate-100 p-2 text-xs font-semibold text-slate-500">
            Antecedent
          </div>
          <div
            className={cn('border-b p-3 font-mono', getTextColor(a))}
            style={{ backgroundColor: `rgba(99, 102, 241, ${getIntensity(a)})` }}
          >
            {a.toLocaleString()}
            <div
              className={cn(
                'text-[10px] font-normal',
                getIntensity(a) > 0.5 ? 'text-green-300/70' : 'text-green-600/70',
              )}
            >
              Matched (a)
            </div>
          </div>
          <div
            className={cn('border-b p-3 font-mono', getTextColor(b))}
            style={{ backgroundColor: `rgba(99, 102, 241, ${getIntensity(b)})` }}
          >
            {b.toLocaleString()}
            <div className={cn('text-[10px] font-normal', getSubTextColor(b))}>Mismatch (b)</div>
          </div>

          <div className="flex items-center justify-center bg-slate-100 p-2 text-xs font-semibold text-slate-500">
            No Antecedent
          </div>
          <div
            className={cn('border-b p-3 font-mono', getTextColor(c))}
            style={{ backgroundColor: `rgba(99, 102, 241, ${getIntensity(c)})` }}
          >
            {c.toLocaleString()}
            <div className={cn('text-[10px] font-normal', getSubTextColor(c))}>Mismatch (c)</div>
          </div>
          <div
            className={cn('border-b p-3 font-mono', getTextColor(d))}
            style={{ backgroundColor: `rgba(99, 102, 241, ${getIntensity(d)})` }}
          >
            {d.toLocaleString()}
            <div className={cn('text-[10px] font-normal', getSubTextColor(d))}>Rest (d)</div>
          </div>
        </div>
        <div className="text-muted-foreground mt-2 text-right text-xs">
          Total Objects: <strong>{total.toLocaleString()}</strong>
        </div>
      </CardContent>
    </Card>
  );
}
