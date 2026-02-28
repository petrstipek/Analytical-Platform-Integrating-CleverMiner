import type { BoxplotStats } from '../../../domain/dataset-profile.type';

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

export default function NumericBoxplotSummary({ box }: { box: BoxplotStats }) {
  const min = box.lower_whisker;
  const max = box.upper_whisker;

  const norm = (v: number) => (max === min ? 0.5 : clamp01((v - min) / (max - min)));

  const q1 = norm(box.q1);
  const med = norm(box.median);
  const q3 = norm(box.q3);

  return (
    <div className="space-y-3">
      <div className="h-10 w-full">
        <svg viewBox="0 0 100 20" className="h-full w-full">
          <line
            x1="5"
            y1="10"
            x2="95"
            y2="10"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />

          <rect
            x={5 + q1 * 90}
            y={5}
            width={(q3 - q1) * 90}
            height={10}
            fill="currentColor"
            opacity="0.15"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1={5 + med * 90}
            y1="5"
            x2={5 + med * 90}
            y2="15"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="grid gap-2 text-sm md:grid-cols-3">
        <div className="rounded-md border p-3">
          <div className="text-muted-foreground text-xs">Q1</div>
          <div className="font-semibold">{box.q1}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-muted-foreground text-xs">Median</div>
          <div className="font-semibold">{box.median}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-muted-foreground text-xs">Q3</div>
          <div className="font-semibold">{box.q3}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-muted-foreground text-xs">Lower whisker</div>
          <div className="font-semibold">{box.lower_whisker}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-muted-foreground text-xs">Upper whisker</div>
          <div className="font-semibold">{box.upper_whisker}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-muted-foreground text-xs">Outliers</div>
          <div className="font-semibold">{box.outlier_count}</div>
        </div>
      </div>
    </div>
  );
}
