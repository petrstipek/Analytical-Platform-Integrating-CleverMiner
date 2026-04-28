import { Search } from 'lucide-react';
import { ScrollArea } from '@/shared/components/ui/molecules/scroll-area';
import { Input } from '@/shared/components/ui/atoms/input';
import { PlatformCard } from '@/shared/components/molecules';
import { ColumnCard } from '@/modules/datasets/components/molecules';
import {
  TransformOptions,
  type TransformStep,
} from '@/modules/datasets/domain/datasetTransformations.type';
import type { DatasetColumnStats } from '@/modules/datasets/api/types/clmGuidance.type';
import { cn } from '@/lib/utils';

type ColumnsListProps = {
  filteredColumns: { data: any; status: 'good' | 'warning' | 'bad' }[];
  steps: TransformStep[];
  stats: { total: number; good: number; warning: number; bad: number };
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: 'good' | 'warning' | 'bad' | null;
  setStatusFilter: (v: 'good' | 'warning' | 'bad' | null) => void;
  onColumnClick: (col: DatasetColumnStats) => void;
  onVisibilityChange: (column: string, visible: boolean) => void;
};

export default function PreprocessingColumnsList({
  filteredColumns,
  steps,
  stats,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onColumnClick,
  onVisibilityChange,
}: ColumnsListProps) {
  return (
    <PlatformCard cardTitle="Dataset Columns" cardDescription="Explore Columns and Preprocess them">
      <div className="relative mb-4">
        <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
        <Input
          placeholder="Search columns..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mb-3 flex gap-2">
        {([null, 'good', 'warning', 'bad'] as const).map((s) => (
          <button
            key={String(s)}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              statusFilter === s
                ? s === 'good'
                  ? 'bg-green-600 text-white'
                  : s === 'warning'
                    ? 'bg-amber-500 text-white'
                    : s === 'bad'
                      ? 'bg-gray-500 text-white'
                      : 'bg-gray-800 text-white'
                : 'text-muted-foreground hover:bg-gray-100',
            )}
          >
            {s === null
              ? `All (${stats.total})`
              : s === 'good'
                ? `Ready (${stats.good})`
                : s === 'warning'
                  ? `Needs review (${stats.warning})`
                  : `Ignored (${stats.bad})`}
          </button>
        ))}
      </div>
      <p className="text-muted-foreground mb-3 text-sm">
        Click any column to configure transformations. Use the filters to focus on columns that need
        attention.
      </p>
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
              onClick={() => onColumnClick(item.data)}
              className={hasSteps ? 'border-blue-200 bg-blue-50' : ''}
              visible={item.data.visible ?? true}
              onVisibilityChange={(visible) => onVisibilityChange(item.data.name, visible)}
              showVisibility={true}
            />
          );
        })}
      </ScrollArea>
    </PlatformCard>
  );
}
