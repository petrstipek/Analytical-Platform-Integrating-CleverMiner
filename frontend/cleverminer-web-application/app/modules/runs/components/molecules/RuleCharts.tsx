import { SingleBarChart } from '@/modules/runs/components/organisms';

interface RuleChartsProps {
  fourfold: number[];
  leftTitle?: string;
  rightTitle?: string;
}

export default function RuleCharts({ fourfold, leftTitle, rightTitle }: RuleChartsProps) {
  const [a, b, c, d] = fourfold;
  const anteTotal = a + b;
  const total = a + b + c + d;

  const anteData = [
    { name: 'Succedent', value: a, percent: ((a / anteTotal) * 100).toFixed(1) },
    { name: 'not S', value: b, percent: ((b / anteTotal) * 100).toFixed(1) },
  ];
  const entireDatasetData = [
    { name: 'Succedent', value: a + c, percent: (((a + c) / total) * 100).toFixed(1) },
    { name: 'not S', value: b + d, percent: (((b + d) / total) * 100).toFixed(1) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <SingleBarChart title={leftTitle ?? 'Within Antecedent'} data={anteData} />
      <SingleBarChart title={rightTitle ?? 'Entire Dataset'} data={entireDatasetData} />
    </div>
  );
}
