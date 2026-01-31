import { useState, useMemo } from 'react';
import { Search, CheckCircle2, AlertTriangle, XCircle, Play, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/shared/components/ui/molecules/scroll-area';
import { Input } from '@/shared/components/ui/atoms/input';
import type {
  DatasetColumnStats,
  DatasetStats,
} from '@/modules/datasets/api/types/clmGuidance.type';
import { ColumnCard } from '@/modules/datasets/components/molecules';
import ColumnsSummaryCard from '@/modules/datasets/components/atoms/ColumnsSummaryCard';
import ColumnDetailsDrawer from '@/modules/datasets/components/molecules/ColumnDetailsDrawer';
import { useTransformations } from '@/modules/datasets/hooks/datasetTransformation.hook';
import { Badge } from '@/shared/components/ui/atoms/badge';
import { Button } from '@/shared/components/ui/atoms/button';
import {
  TransformOptions,
  type TransformStep,
} from '@/modules/datasets/domain/datasetTransformations.type';
import { createDerivedDataset } from '@/modules/datasets/api/dataset-analysis.api';

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

  async function handleTransformation() {
    if (steps.length === 0) return;

    //TODO - needs refactor, loading and error states

    const payload = {
      name: `Derived_${new Date().toISOString()}`,
      transform_spec: { steps },
      output_format: 'csv' as const,
    };

    console.log(payload);
    const derived = await createDerivedDataset(datasetId, payload);
    console.log(derived);
  }

  return (
    <div className="flex flex-col gap-4">
      {steps.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-2 sticky top-0 z-10 flex items-center justify-between border-b bg-blue-50 p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-blue-900">
              {steps.length} transformations staged
            </span>
            <div className="flex gap-2">
              {steps.map((s, idx) => {
                const cols = affectedColumns(s);
                const label = cols.length > 0 ? cols.join(', ') : '(no column)';

                return (
                  <>
                    <Badge key={`${s.op}-${idx}`} variant="secondary" className="bg-blue-100">
                      {label}: {s.op}
                      <button
                        onClick={() => removeStepAtGlobalIndex(idx)}
                        className="ml-2 hover:text-red-500"
                        type="button"
                      >
                        ×
                      </button>
                    </Badge>
                  </>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-gray-600">
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
            <Button size="sm" onClick={handleTransformation}>
              <Play className="mr-2 h-4 w-4 fill-current" /> Apply All
            </Button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <ColumnsSummaryCard
          title="Total Columns"
          value={stats.total}
          icon={null}
          color="text-gray-900"
          bg="bg-white"
        />
        <ColumnsSummaryCard
          title="Ready to Use"
          value={stats.good}
          icon={<CheckCircle2 className="h-4 w-4" />}
          color="text-green-700"
          bg="bg-green-50"
        />
        <ColumnsSummaryCard
          title="Needs Review"
          value={stats.warning}
          icon={<AlertTriangle className="h-4 w-4" />}
          color="text-amber-700"
          bg="bg-amber-50"
        />
        <ColumnsSummaryCard
          title="Ignored"
          value={stats.bad}
          icon={<XCircle className="h-4 w-4" />}
          color="text-gray-500"
          bg="bg-gray-50"
        />
      </div>

      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
        <Input
          placeholder="Search columns..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[800px] w-full rounded-md border bg-gray-50/50 p-4">
        {filteredColumns.length > 0 ? (
          <div className="flex flex-col gap-1">
            {filteredColumns.map((item) => (
              <ColumnCard
                key={item.data.name}
                col={item.data}
                status={item.status}
                onClick={() => setSelectedColumn(item.data)}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center text-gray-500">
            No columns found matching "{searchTerm}"
          </div>
        )}
      </ScrollArea>
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
  );
}
