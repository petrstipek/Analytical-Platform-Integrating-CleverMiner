import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface SingleBarChartProps {
  title: string;
  data: { name: string; value: number; percent: string }[];
}

export default function SingleBarChart({ title, data }: SingleBarChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded border bg-white p-2 text-xs shadow-sm">
          <p className="font-bold">{payload[0].payload.name}</p>
          <p>Count: {payload[0].value.toLocaleString()}</p>
          <p>Share: {payload[0].payload.percent}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-sm font-medium break-words">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="percent"
                  position="top"
                  formatter={(v: string) => `${v}%`}
                  style={{ fontSize: 11, fontWeight: 600, fill: '#475569' }}
                />
                {data.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#a5b4fc' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          {data.map((entry, i) => (
            <div
              key={entry.name}
              className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600"
            >
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: i === 0 ? '#a5b4fc' : '#94a3b8' }}
              />
              <span className="shrink-0">{entry.name}:</span>
              <span className="shrink-0 font-semibold">{entry.percent}%</span>
              <span className="text-muted-foreground shrink-0">
                ({entry.value.toLocaleString()})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
