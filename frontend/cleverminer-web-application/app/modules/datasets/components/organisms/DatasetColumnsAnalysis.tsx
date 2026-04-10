import { useState, useMemo } from 'react';
import { Search, Play, Trash2, Book } from 'lucide-react';
import { ScrollArea } from '@/shared/components/ui/molecules/scroll-area';
import { Input } from '@/shared/components/ui/atoms/input';
import type {
  DatasetColumnStats,
  DatasetStats,
} from '@/modules/datasets/api/types/clmGuidance.type';
import { ColumnCard } from '@/modules/datasets/components/molecules';
import ColumnDetailsDrawer from '@/modules/datasets/components/molecules/ColumnDetailsDrawer';
import { useTransformations } from '@/modules/datasets/hooks/datasetTransformation.hook';
import { Badge } from '@/shared/components/ui/atoms/badge';
import { Button } from '@/shared/components/ui/atoms/button';
import {
  TransformOptions,
  type TransformStep,
} from '@/modules/datasets/domain/datasetTransformations.type';
import { createDerivedDataset } from '@/modules/datasets/api/dataset-analysis.api';
import { BaseStatCard } from '@/shared/components/atoms';
import { PlatformCard } from '@/shared/components/molecules';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/molecules/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';

type DatasetColumnsAnalysisView = {
  columnsAnalysis: DatasetStats;
  datasetId: string;
};
export default function DatasetColumnsAnalysisView({
  columnsAnalysis,
  datasetId,
}: DatasetColumnsAnalysisView) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumn, setSelectedColumn] = useState<DatasetColumnStats | null>(null);
  const [derivedName, setDerivedName] = useState(`Derived_${new Date().toISOString()}`);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { steps, upsertStep, removeStepAtGlobalIndex, clearAll } = useTransformations();

  const processedColumns = useMemo(() => {
    if (!columnsAnalysis?.columns) return [];

    return columnsAnalysis.columns.map((col: any) => {
      let status: 'good' | 'warning' | 'bad' = 'warning';

      if (col.clm_guidance?.recommended_representation === 'ignore') {
        status = 'bad';
      } else if (col.clm_guidance?.clm_usable_as_is) {
        status = 'good';
      }

      const mappedCol = {
        ...col,
        clm: col.clm_guidance,
        reason: col.clm_guidance?.reasons?.[0],
      };

      return { data: mappedCol, status };
    });
  }, [columnsAnalysis]);

  const filteredColumns = useMemo(() => {
    return processedColumns.filter((item) =>
      item.data.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [processedColumns, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: processedColumns.length,
      good: processedColumns.filter((c) => c.status === 'good').length,
      warning: processedColumns.filter((c) => c.status === 'warning').length,
      bad: processedColumns.filter((c) => c.status === 'bad').length,
    };
  }, [processedColumns]);

  function hasColumn(step: TransformStep): step is Extract<TransformStep, { column: string }> {
    return 'column' in step;
  }

  const stagedStepsForColumn = steps
    .map((step, index) => ({ step, index }))
    .filter(({ step }) => hasColumn(step) && step.column === selectedColumn?.name);

  function affectedColumns(step: TransformStep): string[] {
    if ('column' in step) return [step.column];
    if (step.op === TransformOptions.dropColumns) return step.columns;
    return [];
  }

  const {
    mutate: applyTransformation,
    isPending,
    data,
  } = useMutation({
    mutationFn: async (payload: { name: string; transform_spec: { steps: TransformStep[] } }) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return createDerivedDataset(datasetId, payload);
    },
    onError: (error: any) => toast.error(error.message),
    onSuccess: () => {
      toast.success('Transformation applied successfully! The dataset will be available soon.');
      console.log('Transformation applied successfully!', data);
      clearAll();
    },
  });

  async function handleTransformation() {
    if (steps.length === 0) {
      return toast.error('No transformation steps staged. Please add some transformations first.');
    }

    setDialogOpen(false);

    applyTransformation({
      name: derivedName,
      transform_spec: { steps },
    });
  }

  function formatStepLabel(step: TransformStep): string {
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

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="flex flex-col gap-4">
        {steps.length > 0 && (
          <PlatformCard
            cardTitle={'Applied Preprocess steps'}
            cardDescription={'Preview preprocessed steps.'}
          >
            <div className="animate-in fade-in slide-in-from-top-2 sticky top-0 z-10 grid grid-cols-[1fr_auto] items-start gap-2 rounded-2xl border-b bg-blue-50 p-4 shadow-sm">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-blue-900">
                  {steps.length} transformations staged
                </span>

                <ScrollArea className="h-100 pr-3">
                  <div className="flex flex-col gap-2">
                    {Object.entries(
                      steps.reduce<Record<string, { step: TransformStep; idx: number }[]>>(
                        (acc, s, idx) => {
                          const cols = affectedColumns(s);
                          const key = cols.length > 0 ? cols.join(', ') : '(no column)';
                          if (!acc[key]) acc[key] = [];
                          acc[key].push({ step: s, idx });
                          return acc;
                        },
                        {},
                      ),
                    ).map(([colName, entries]) => (
                      <div
                        key={colName}
                        className="bg-background/80 rounded-2xl border shadow-xl ring-1 ring-black/5"
                      >
                        <div className="rounded-t-2xl bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800">
                          {colName}
                        </div>
                        <ul className="divide-y divide-gray-100">
                          {entries.map(({ step, idx }) => (
                            <li
                              key={idx}
                              className="flex items-center justify-between px-3 py-1.5 text-xs"
                            >
                              <span className="text-gray-700">{formatStepLabel(step)}</span>
                              <button
                                type="button"
                                onClick={() => removeStepAtGlobalIndex(idx)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={clearAll} className="text-gray-600">
                  <Trash2 className="mr-2 h-4 w-4" /> Clear All
                </Button>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Book className="mr-2 h-4 w-4" /> Dataset Transformation
                  </Button>
                </DialogTrigger>
              </div>
            </div>
          </PlatformCard>
        )}
        <PlatformCard
          cardTitle={'Columns Base Stats'}
          cardDescription={'Explore summary statistics.'}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <BaseStatCard
              title="Total columns"
              value={stats.total}
              className={'border-l-blue-300 bg-blue-50'}
            />
            <BaseStatCard
              title="Ready to use"
              value={stats.good}
              className={'border-l-green-500 bg-green-50'}
            />
            <BaseStatCard
              title="Needs review"
              value={stats.warning}
              className={'border-l-orange-500 bg-orange-50'}
            />
            <BaseStatCard
              title="Ignored"
              value={stats.bad}
              className={'border-l-gray-500 bg-gray-50'}
            />
          </div>
        </PlatformCard>

        <PlatformCard
          cardTitle={'Dataset Columns'}
          cardDescription={'Explore Columns and Preprocess them'}
        >
          <div className="relative mb-4">
            <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
            <Input
              placeholder="Search columns..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[800px] w-full rounded-md border bg-gray-50/50 p-4">
            {filteredColumns.map((item) => {
              const hasSteps = steps.some(
                (s) =>
                  ('column' in s && s.column === item.data.name) ||
                  (s.op === TransformOptions.dropColumns && s.columns.includes(item.data.name)),
              );

              return (
                <ColumnCard
                  key={item.data.name}
                  col={item.data}
                  status={item.status}
                  onClick={() => setSelectedColumn(item.data)}
                  className={hasSteps ? 'border-blue-200 bg-blue-50' : ''}
                />
              );
            })}
          </ScrollArea>
        </PlatformCard>
        <ColumnDetailsDrawer
          open={!!selectedColumn}
          column={selectedColumn}
          onOpenChange={(isOpen) => !isOpen && setSelectedColumn(null)}
          stagedSteps={stagedStepsForColumn.map((s) => s.step)}
          onAddStep={upsertStep}
          onRemoveStep={(localIndex) => {
            const globalIndex = stagedStepsForColumn[localIndex].index;
            removeStepAtGlobalIndex(globalIndex);
          }}
        />
      </div>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apply Dataset Transformation</DialogTitle>
          <DialogDescription>
            <div className={'space-y-4'}>
              <p>This action will apply the selected transformations to the dataset.</p>
              <p>
                New dataset will be created! You can later view the dataset in the Datasets overview
                or look at derived dataset in the Explore Dataset Transformations button.
              </p>
              <div className={'space-y-6'}>
                <div>
                  <label className="flex items-center gap-2">Derived dataset name</label>
                  <Input
                    placeholder="e.g. Derived Dataset 2024-01-01"
                    value={derivedName}
                    onChange={(e) => setDerivedName(e.target.value)}
                  />
                </div>
                <div className={'flex flex-col gap-2'}>
                  <Button
                    size="sm"
                    onClick={handleTransformation}
                    disabled={isPending}
                    className="bg-green-500"
                  >
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    {isPending ? 'Applying...' : 'Apply All'}
                  </Button>
                  <Button variant={'destructive'}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
