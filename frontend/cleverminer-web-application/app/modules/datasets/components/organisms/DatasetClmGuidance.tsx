import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ScrollArea } from '@/shared/components/ui/molecules/scroll-area';
import { ColumnCard } from '@/modules/datasets/components/molecules';
import type {
  ClmCandidate,
  DatasetColumnStats,
  DatasetStats,
} from '@/modules/datasets/api/types/clmGuidance.type';
import { PlatformCard } from '@/shared/components/molecules';

type DatasetClmGuidanceViewProps = {
  datasetId: number;
  goodCols: ClmCandidate[];
  warningCols: ClmCandidate[];
  ignoredCols: ClmCandidate[];
  columnStatsData?: DatasetStats;
};

export default function DatasetClmGuidanceView({
  goodCols,
  warningCols,
  ignoredCols,
  columnStatsData,
}: DatasetClmGuidanceViewProps) {
  const getCategoryOrder = (colName: string): string[] =>
    columnStatsData?.columns?.find((c: DatasetColumnStats) => c.name === colName)?.category_order ??
    [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <PlatformCard
          cardTitle={
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-green-700 uppercase">
              <CheckCircle className="h-4 w-4" /> Ready ({goodCols.length})
            </h3>
          }
          cardDescription={'Explore ready columns.'}
        >
          <ScrollArea className="h-[770px] pr-4">
            {goodCols.map((col) => (
              <ColumnCard
                key={col.name}
                col={col}
                status="good"
                categoryOrder={getCategoryOrder(col.name)}
              />
            ))}
          </ScrollArea>
        </PlatformCard>
        <PlatformCard
          cardTitle={
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-amber-700 uppercase">
              <AlertTriangle className="h-4 w-4" /> Needs Binning ({warningCols.length})
            </h3>
          }
          cardDescription={'Explore columns that need binning.'}
        >
          <ScrollArea className="h-[770px] pr-4">
            {warningCols.map((col) => (
              <ColumnCard
                key={col.name}
                col={col}
                status="warning"
                categoryOrder={getCategoryOrder(col.name)}
              />
            ))}
          </ScrollArea>
        </PlatformCard>

        <PlatformCard
          cardTitle={
            <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
              <XCircle className="h-4 w-4" /> Ignored ({ignoredCols.length})
            </h3>
          }
          cardDescription={'Advised to ignore,'}
        >
          <ScrollArea className="h-[770px] pr-4">
            {ignoredCols.map((col) => (
              <ColumnCard
                key={col.name}
                col={col}
                status="bad"
                categoryOrder={getCategoryOrder(col.name)}
              />
            ))}
          </ScrollArea>
        </PlatformCard>
      </div>
    </div>
  );
}
