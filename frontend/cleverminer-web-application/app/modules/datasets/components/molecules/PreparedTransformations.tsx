import { Badge } from '@/shared/components/ui/atoms/badge';
import {
  TransformOptions,
  type TransformStep,
} from '@/modules/datasets/domain/datasetTransformations.type';
import { formatStepLabel } from '@/modules/datasets/utils/formatStepLabel';
import { Button } from '@/shared/components/ui/atoms/button';
import { Book, Trash2 } from 'lucide-react';
import { DialogTrigger } from '@/shared/components/ui/molecules/dialog';

type PreparedTransformationsProps = {
  steps: TransformStep[];
  removeStepAtGlobalIndex: (globalIndex: number) => void;
  clearAll: () => void;
};

export default function PreparedTransformations({
  steps,
  removeStepAtGlobalIndex,
  clearAll,
}: PreparedTransformationsProps) {
  function affectedColumns(step: TransformStep): string[] {
    if ('column' in step) return [step.column];
    if (step.op === TransformOptions.dropColumns) return step.columns;
    return [];
  }

  return (
    <div className="animate-in fade-in slide-in-from-top-2 sticky top-0 z-10 rounded-2xl border-b bg-blue-50 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-blue-900">
          <Badge variant="secondary" className="bg-blue-200 text-blue-800">
            {steps.length}
          </Badge>
          Transformations staged
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearAll} className="bg-white text-gray-600">
            <Trash2 className="mr-2 h-4 w-4" /> Clear All
          </Button>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Book className="mr-2 h-4 w-4" /> Apply Transformations
            </Button>
          </DialogTrigger>
        </div>
      </div>

      <div className="max-h-[250px] w-full overflow-y-auto rounded-md bg-blue-50 pr-4">
        <div className="flex flex-col gap-3 pb-2">
          {Object.entries(
            steps.reduce<Record<string, { step: TransformStep; idx: number }[]>>((acc, s, idx) => {
              const cols = affectedColumns(s);
              const key = cols.length > 0 ? cols.join(', ') : '(no column)';
              if (!acc[key]) acc[key] = [];
              acc[key].push({ step: s, idx });
              return acc;
            }, {}),
          ).map(([colName, entries]) => (
            <div
              key={colName}
              className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm"
            >
              <div className="border-b border-blue-100 bg-blue-100/50 px-3 py-1.5 text-[11px] font-bold tracking-wider text-blue-700 uppercase">
                Column: {colName}
              </div>
              <ul className="divide-y divide-gray-50">
                {entries.map(({ step, idx }) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-700">{formatStepLabel(step)}</span>
                    <button
                      type="button"
                      onClick={() => removeStepAtGlobalIndex(idx)}
                      className="ml-2 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
