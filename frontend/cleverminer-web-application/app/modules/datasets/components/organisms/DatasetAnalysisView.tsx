import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ScrollArea } from '@/shared/components/ui/molecules/scroll-area';
import { ColumnCard } from '@/modules/datasets/components/molecules';
import type { ClmAnalysisResponse } from '@/modules/datasets/api/types/clmGuidance.type';

type DatasetClmGuidanceViewProps = {
  datasetId: number;
  clmGuidance: ClmAnalysisResponse;
};

export default function DatasetClmGuidanceView({
  clmGuidance: analysis,
}: DatasetClmGuidanceViewProps) {
  const goodCols = analysis.target_candidates.filter((c) => c.clm?.clm_usable_as_is);
  const warningCols = analysis.target_candidates.filter((c) => c.clm && !c.clm.clm_usable_as_is);
  const ignoredCols = analysis.ignored_candidates;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-green-700 uppercase">
            <CheckCircle className="h-4 w-4" /> Ready ({goodCols.length})
          </h3>
          <ScrollArea className="h-[600px] pr-4">
            {goodCols.map((col) => (
              <ColumnCard key={col.name} col={col} status="good" />
            ))}
          </ScrollArea>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-amber-700 uppercase">
            <AlertTriangle className="h-4 w-4" /> Needs Binning ({warningCols.length})
          </h3>
          <p className="text-muted-foreground mb-2 text-xs">
            Continuous numbers need to be grouped (e.g., Age 0-10, 11-20)
          </p>
          <ScrollArea className="h-[600px] pr-4">
            {warningCols.map((col) => (
              <ColumnCard key={col.name} col={col} status="warning" />
            ))}
          </ScrollArea>
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
            <XCircle className="h-4 w-4" /> Ignored ({ignoredCols.length})
          </h3>
          <p className="text-muted-foreground mb-2 text-xs">
            ID columns or too many unique strings
          </p>
          <ScrollArea className="h-[600px] pr-4">
            {ignoredCols.map((col) => (
              <ColumnCard key={col.name} col={col} status="bad" />
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
