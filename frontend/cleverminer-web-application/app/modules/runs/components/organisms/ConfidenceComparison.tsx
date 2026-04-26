import { SingleBarChart } from '@/modules/runs/components/organisms/index';

type ConfidenceComparisonProps = {
  fourfold1: number[];
  fourfold2: number[];
  label1: string;
  label2: string;
};

export default function ConfidenceComparison({
  fourfold1,
  fourfold2,
  label1,
  label2,
}: ConfidenceComparisonProps) {
  const toData = (fourfold: number[]) => {
    const [a, b] = fourfold;
    const total = a + b;
    return [
      { name: 'S', value: a, percent: ((a / total) * 100).toFixed(1) },
      { name: 'not S', value: b, percent: ((b / total) * 100).toFixed(1) },
    ];
  };

  const conf1 = fourfold1[0] / (fourfold1[0] + fourfold1[1]);
  const conf2 = fourfold2[0] / (fourfold2[0] + fourfold2[1]);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <SingleBarChart title={label1} data={toData(fourfold1)} />
        <SingleBarChart title={label2} data={toData(fourfold2)} />
      </div>
      <p className="text-muted-foreground text-center text-xs">
        Confidence ratio: <strong>{(conf1 / conf2).toFixed(3)}</strong> &nbsp;|&nbsp; Delta:{' '}
        <strong>{((conf1 - conf2) * 100).toFixed(2)}%</strong>
      </p>
    </div>
  );
}
