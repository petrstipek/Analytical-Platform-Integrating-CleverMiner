import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';

interface FourfoldTableProps {
  data: [number, number, number, number];
}

export default function FourfoldTable({ data }: FourfoldTableProps) {
  const [a, b, c, d] = data;
  const total = a + b + c + d;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          Contingency Table (4ft)
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
          <div className="border-r border-b bg-green-50 p-3 font-mono font-bold text-green-700">
            {a.toLocaleString()}
            <div className="text-[10px] font-normal text-green-600/70">Matched (a)</div>
          </div>
          <div className="border-b bg-white p-3 font-mono text-slate-700">
            {b.toLocaleString()}
            <div className="text-[10px] font-normal text-slate-400">Mismatch (b)</div>
          </div>

          <div className="flex items-center justify-center bg-slate-100 p-2 text-xs font-semibold text-slate-500">
            No Antecedent
          </div>
          <div className="border-r bg-white p-3 font-mono text-slate-700">
            {c.toLocaleString()}
            <div className="text-[10px] font-normal text-slate-400">Mismatch (c)</div>
          </div>
          <div className="bg-slate-50 p-3 font-mono text-slate-700">
            {d.toLocaleString()}
            <div className="text-[10px] font-normal text-slate-400">Rest (d)</div>
          </div>
        </div>
        <div className="text-muted-foreground mt-2 text-right text-xs">
          Total Objects: <strong>{total.toLocaleString()}</strong>
        </div>
      </CardContent>
    </Card>
  );
}
