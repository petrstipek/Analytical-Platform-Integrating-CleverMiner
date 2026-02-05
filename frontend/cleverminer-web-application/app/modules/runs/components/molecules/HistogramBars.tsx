import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';

export default function HistogramBars({
  title,
  categories,
  values,
}: {
  title: string;
  categories: string[];
  values: number[];
}) {
  const max = Math.max(1, ...values);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {values.map((v, i) => {
          const label = categories[i] ?? `Cat ${i + 1}`;
          const pct = (v / max) * 100;

          return (
            <div key={`${label}-${i}`} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono">{v}</span>
              </div>
              <div className="bg-muted h-2 w-full rounded">
                <div className="bg-foreground/70 h-2 rounded" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
