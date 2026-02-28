'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/molecules/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/components/ui/molecules/chart';
import type { Histogram } from '@/modules/datasets/domain/dataset-profile.type';

type Props = {
  attributeName: string;
  histogram: Histogram;
};

function toChartData(hist: Histogram) {
  const { bin_edges, counts } = hist;

  const n = Math.min(counts.length, Math.max(0, bin_edges.length - 1));

  return Array.from({ length: n }).map((_, i) => {
    const left = bin_edges[i];
    const right = bin_edges[i + 1];

    return {
      label: `${left.toFixed(1)}–${right.toFixed(1)}`,
      range: `${left} – ${right}`,
      count: counts[i],
    };
  });
}

// shadcn bar chart updated
export default function NumericHistogramBarChart({ attributeName, histogram }: Props) {
  const chartData = toChartData(histogram);

  const chartConfig = {
    count: {
      label: 'Count',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  const descParts = [
    `Strategy: ${histogram.strategy}`,
    `Bins: ${histogram.bins}`,
    typeof histogram.skew === 'number' ? `Skew: ${histogram.skew.toFixed(2)}` : null,
  ].filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{attributeName}</CardTitle>
        <CardDescription>{descParts.join(' • ')}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval="preserveStartEnd"
              tickFormatter={(v) => String(v).slice(0, 8)}
            />

            <YAxis tickLine={false} axisLine={false} width={40} />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.range ?? ''}
                  formatter={(value) => [value, 'Count']}
                />
              }
            />

            <Bar dataKey="count" fill="var(--color-cleverminer-two)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
