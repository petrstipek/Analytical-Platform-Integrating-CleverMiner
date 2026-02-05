import {
  TransformOptions,
  type TransformStep,
} from '@/modules/datasets/domain/datasetTransformations.type';

export function stepLabel(step: TransformStep): string {
  switch (step.op) {
    case TransformOptions.fillMissingNumbers:
      return step.strategy === 'constant' ? `constant = ${String(step.value)}` : step.strategy;

    case TransformOptions.discretize:
      if (step.method === 'explicit') {
        return `explicit · bins=${step.bins.length} → ${
          step.output_column ?? `${step.column}_bin`
        }`;
      }
      return `${step.method} · k=${step.k} → ${step.output_column ?? `${step.column}_bin`}`;

    case TransformOptions.dropColumns:
      return `columns: ${step.columns.join(', ')}`;

    case TransformOptions.dropRows:
      return `where: ${step.where.column}`;

    default: {
      return step;
    }
  }
}

export function parseConstant(raw: string): string | number | null {
  const v = raw.trim();
  if (!v) return null;
  return Number.isNaN(Number(v)) ? v : Number(v);
}

export function parseBins(raw: string): number[] | null {
  const parts = raw
    .split(/[,\s]+/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length < 2) return null;

  const nums = parts.map(Number);
  if (nums.some((n) => Number.isNaN(n))) return null;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] <= nums[i - 1]) return null;
  }
  return nums;
}

export function parseLabels(raw: string): string[] | undefined {
  const parts = raw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  return parts.length ? parts : undefined;
}

export function labelsMatchBins(labels: string[] | undefined, bins: number[] | null): boolean {
  if (!labels) return true;
  if (!bins) return true;
  return labels.length === bins.length - 1;
}
