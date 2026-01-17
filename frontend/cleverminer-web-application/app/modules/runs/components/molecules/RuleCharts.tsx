import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/molecules/card';

interface RuleChartsProps {
  fourfold: [number, number, number, number];
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
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={anteData}>
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                <Cell fill="#a5b4fc" />
                <Cell fill="#94a3b8" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none text-center text-xs font-bold">
            <span className="mr-12">{anteData[0].percent}%</span>
            <span className="ml-12">{anteData[1].percent}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-sm font-medium">Entire Dataset</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={globalData}>
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                <Cell fill="#475569" />
                <Cell fill="#cbd5e1" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none relative z-10 mt-[-30px] text-center text-xs font-bold">
            <span className="mr-12">{globalData[0].percent}%</span>
            <span className="ml-12">{globalData[1].percent}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
