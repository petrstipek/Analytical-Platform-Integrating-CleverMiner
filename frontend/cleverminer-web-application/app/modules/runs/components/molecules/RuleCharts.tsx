import { Bar, BarChart, XAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/molecules/card';

interface RuleChartsProps {
  fourfold: number[];
}

export default function RuleCharts({ fourfold }: RuleChartsProps) {
  const [a, b, c, d] = fourfold;

  const anteTotal = a + b;
  const anteData = [
    { name: 'Succedent (S)', value: a, percent: ((a / anteTotal) * 100).toFixed(1) },
    { name: 'Not S', value: b, percent: ((b / anteTotal) * 100).toFixed(1) },
  ];

  const total = a + b + c + d;
  const succTotal = a + c;
  const notSuccTotal = b + d;

  const globalData = [
    { name: 'Succedent (S)', value: succTotal, percent: ((succTotal / total) * 100).toFixed(1) },
    { name: 'Not S', value: notSuccTotal, percent: ((notSuccTotal / total) * 100).toFixed(1) },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-sm font-medium">Within Antecedent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={anteData}>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="percent"
                    position="top"
                    formatter={(value: string) => `${value}%`}
                    style={{ fontSize: 11, fontWeight: 600, fill: '#475569' }}
                  />
                  <Cell fill="#a5b4fc" />
                  <Cell fill="#94a3b8" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {anteData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ background: i === 0 ? '#a5b4fc' : '#94a3b8' }}
                />
                <span>{entry.name}:</span>
                <span className="font-semibold">{entry.percent}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-sm font-medium">Entire Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={globalData}>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="percent"
                    position="top"
                    formatter={(value: string) => `${value}%`}
                    style={{ fontSize: 11, fontWeight: 600, fill: '#475569' }}
                  />
                  <Cell fill="#475569" />
                  <Cell fill="#cbd5e1" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {globalData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ background: i === 0 ? '#a5b4fc' : '#94a3b8' }}
                />
                <span>{entry.name}:</span>
                <span className="font-semibold">{entry.percent}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
