import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';

export default function HistogramBars({
  title,
  categories,
  values,
  colorClass = 'bg-cleverminer-one',
}: {
  title: string;
  categories: string[];
  values: number[];
  colorClass?: string;
}) {
  const max = Math.max(1, ...values);
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <Card className="bg-background/80 overflow-hidden rounded-2xl border shadow-xl ring-1 ring-black/5">
      <CardHeader className="border-border/40 border-b pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-semibold tracking-tight">{title}</CardTitle>
          <span className="text-muted-foreground text-xs tabular-nums">{total} total</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-4">
        {values.map((v, i) => {
          const label = categories[i] ?? `Cat ${i + 1}`;
          const pct = (v / max) * 100;
          const sharePct = total > 0 ? ((v / total) * 100).toFixed(1) : '0.0';

          return (
            <div key={`${label}-${i}`} className="group">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-muted-foreground group-hover:text-foreground max-w-[60%] truncate text-xs transition-colors">
                  {label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs tabular-nums">{sharePct}%</span>
                  <span className="w-8 text-right text-xs font-semibold tabular-nums">{v}</span>
                </div>
              </div>
              <div className="bg-muted relative h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${colorClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
