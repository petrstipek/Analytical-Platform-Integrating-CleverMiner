import { useState, useMemo } from 'react';
import { Search, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { ScrollArea } from '@/shared/components/ui/molecules/scroll-area';
import { Input } from '@/shared/components/ui/atoms/input';
import type { DatasetStats } from '@/modules/datasets/api/types/clmGuidance.type';
import { ColumnCard } from '@/modules/datasets/components/molecules';
import ColumnsSummaryCard from '@/modules/datasets/components/atoms/ColumnsSummaryCard';

type DatasetColumnsAnalysisView = {
  columnsAnalysis: DatasetStats;
};
export default function DatasetColumnsAnalysisView({
  columnsAnalysis,
}: DatasetColumnsAnalysisView) {
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="flex flex-col gap-4">
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
              <ColumnCard key={item.data.name} col={item.data} status={item.status} />
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center text-gray-500">
            No columns found matching "{searchTerm}"
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
