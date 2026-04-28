import {
  TransformOptions,
  type TransformStep,
} from '@/modules/datasets/domain/datasetTransformations.type';


export function formatStepLabel(step: TransformStep): string {
  switch (step.op) {
    case TransformOptions.fillMissingNumbers:
      if (step.strategy === 'constant') return `Fill missing → constant (${step.value})`;
      return `Fill missing → ${step.strategy}`;
    case TransformOptions.discretize:
      if (step.method === 'equal_width') return `Bin → equal width (k=${step.k})`;
      if (step.method === 'quantile') return `Bin → quantile (k=${step.k})`;
      if (step.method === 'explicit') return `Bin → explicit (${step.bins?.join(', ')})`;
      return `Bin → ${step.method}`;
    case TransformOptions.dropColumns:
      return `Drop column`;
    default:
      return step.op;
  }
}