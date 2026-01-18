import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import { Calculator } from 'lucide-react';

export default function QuantifiersDetail({ data }: { data: any }) {
  const activeQuantifiers = Object.entries(data).filter(([_, v]) => v !== null && v !== undefined);

  if (activeQuantifiers.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="text-muted-foreground h-4 w-4" />
          <CardTitle className="text-base">Quantifiers & Thresholds</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {activeQuantifiers.map(([key, val]) => (
            <div key={key} className="border-primary/20 flex flex-col border-l-2 py-1 pl-3">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="font-mono text-lg font-semibold text-slate-800">{String(val)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
