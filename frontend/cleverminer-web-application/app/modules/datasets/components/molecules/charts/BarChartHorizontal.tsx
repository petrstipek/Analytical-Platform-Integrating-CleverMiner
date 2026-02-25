import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/molecules/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/components/ui/molecules/chart';

type TopValue = { value: string; count: number; pct: number };

type Props = {
  title: string;
  description?: string;
  topValues: TopValue[];
};

// shadcn BarChartHorizontal
export default function BarChartHorizontal({ title, description, topValues }: Props) {
  const chartData = topValues.map((tv) => ({
    name: tv.value,
    count: tv.count,
    pct: tv.pct,
  }));

  const chartConfig = {
    count: {
      label: 'Count',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: -20, right: 48, top: 4, bottom: 20 }}
          >
            <XAxis
              type="number"
              dataKey="count"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toLocaleString()}
              label={{ value: 'Count', position: 'insideBottom', offset: -5, fontSize: 12 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={140}
              tickFormatter={(value) => String(value).slice(0, 24)}
              label={{ value: 'Category', angle: -90, position: 'insideLeft', fontSize: 12 }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item) => {
                    const pct = item?.payload?.pct;
                    const pctStr = typeof pct === 'number' ? ` (${(pct * 100).toFixed(1)}%)` : '';
                    return [`${value}${pctStr}`, 'Count'];
                  }}
                />
              }
            />

            <Bar dataKey="count" fill="var(--color-cleverminer-two)" radius={5}>
              <LabelList
                dataKey="count"
                position="right"
                fontSize={11}
                formatter={(v: number) => v.toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
