import { useState } from 'react';
import type { TransformStep } from '../domain/datasetTransformations.type';

function isSameTarget(a: TransformStep, b: TransformStep): boolean {
  if ('column' in a && 'column' in b) {
    return a.op === b.op && a.column === b.column;
  }

  if (a.op === 'drop_columns' && b.op === 'drop_columns') {
    return a.columns.some((c) => b.columns.includes(c));
  }

  if (a.op === 'drop_rows' && b.op === 'drop_rows') {
    return a.where.column === b.where.column;
  }

  return false;
}

export function useTransformations() {
  const [steps, setSteps] = useState<TransformStep[]>([]);

  const upsertStep = (step: TransformStep) => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => isSameTarget(s, step));
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = step;
        return next;
      }
      return [...prev, step];
    });
  };
  const removeStepAtGlobalIndex = (index: number) =>
    setSteps((prev) => prev.filter((_, i) => i !== index));

  const clearAll = () => setSteps([]);

  return { steps, upsertStep, removeStepAtGlobalIndex, clearAll };
}
