import type { CSSProperties } from 'react';

function corrToStyle(v: number): CSSProperties {
  const a = Math.abs(v);
  const alpha = a >= 0.8 ? 0.5 : a >= 0.6 ? 0.35 : a >= 0.4 ? 0.22 : a >= 0.2 ? 0.12 : 0.04;
  const color = v > 0 ? '59,130,246' : '239,68,68'; // red for negative, blue for positive
  return { backgroundColor: `rgba(${color},${alpha})` };
}

function corrToText(v: number): string {
  return v.toFixed(2);
}

export default function Row({
  rowLabel,
  row,
  labels,
  rowIndex,
}: {
  rowLabel: string;
  row: number[];
  labels: string[];
  rowIndex: number;
}) {
  return (
    <>
      <div
        className="text-muted-foreground flex items-center truncate pr-3 text-xs font-medium"
        title={rowLabel}
      >
        {rowLabel}
      </div>
      {row.map((v, j) => {
        const isDiagonal = rowIndex === j;
        return (
          <div
            key={`${rowLabel}-${labels[j]}`}
            title={`${rowLabel} ↔ ${labels[j]}: ${v.toFixed(3)}`}
            style={isDiagonal ? { backgroundColor: 'rgba(100,100,100,0.15)' } : corrToStyle(v)}
            className="flex h-9 cursor-default items-center justify-center rounded-sm text-[11px] font-medium transition-opacity hover:opacity-70"
          >
            {isDiagonal ? '—' : corrToText(v)}
          </div>
        );
      })}
    </>
  );
}
