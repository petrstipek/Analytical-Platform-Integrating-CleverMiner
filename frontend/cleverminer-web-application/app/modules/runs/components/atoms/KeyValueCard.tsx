import { Card, CardContent } from '@/shared/components/ui/molecules/card';

export default function KeyValueCard({
  rows,
}: {
  rows: { label: string; value: string | number }[];
}) {
  return (
    <Card>
      <CardContent className="space-y-2 pt-6">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between border-b pb-2 text-sm last:border-b-0">
            <span className="text-muted-foreground">{r.label}</span>
            <span className="font-mono font-bold">{r.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
