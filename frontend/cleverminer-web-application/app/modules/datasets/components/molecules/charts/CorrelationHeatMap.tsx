import type { Correlation } from '../../../domain/dataset-profile.type';
import Row from '@/modules/datasets/components/molecules/charts/atoms/CorrelationHeatMapRow';

export default function CorrelationHeatMap({ corr }: { corr?: Correlation }) {
  if (!corr) {
    return (
      <div className="text-muted-foreground rounded-xl border border-dashed p-6 text-center text-sm">
        Correlation matrix is not available.
      </div>
    );
  }

  const { labels, matrix } = corr;

  return (
    <div className="overflow-auto rounded-xl">
      <div className="min-w-[700px]">
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `140px repeat(${labels.length}, minmax(40px, 1fr))`,
          }}
        >
          <div />

          {labels.map((l) => (
            <div
              key={l}
              className="text-muted-foreground truncate pb-1 text-center text-[11px] font-medium"
              title={l}
            >
              {l}
            </div>
          ))}
          {labels.map((rowLabel, i) => (
            <Row key={rowLabel} rowLabel={rowLabel} row={matrix[i]} labels={labels} rowIndex={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
