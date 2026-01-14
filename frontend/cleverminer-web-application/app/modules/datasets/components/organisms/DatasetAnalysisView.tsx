import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useDatasetAnalysis, useDatasetPreview } from '../../hooks/datasetAnalysis.hook';
import { ColumnCard } from '@/modules/datasets/components/molecules';
import { DatasetSummaryCard } from '@/modules/datasets/components/atoms';

export default function DatasetAnalysisView({ datasetId }: { datasetId: number }) {
  const { data: analysis, isLoading: isAnalysing } = useDatasetAnalysis(datasetId);
  const { data: preview, isLoading: isPreviewing } = useDatasetPreview(datasetId);

  if (isAnalysing || isPreviewing) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-muted-foreground animate-pulse">Analyzing Dataset Structure...</p>
      </div>
    );
  }

  if (!analysis)
    return <div className="p-10 text-center text-red-500">Failed to load analysis.</div>;

  const goodCols = analysis.target_candidates.filter((c) => c.clm?.clm_usable_as_is);
  const warningCols = analysis.target_candidates.filter((c) => c.clm && !c.clm.clm_usable_as_is);
  const ignoredCols = analysis.ignored_candidates;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
      <div className="grid gap-4 md:grid-cols-3">
        <DatasetSummaryCard
          title="Total Rows"
          value={analysis.meta.total_rows_analyzed}
          variant="default"
        />

        <DatasetSummaryCard title="Ready for Mining" value={goodCols.length} variant="success" />

        <DatasetSummaryCard
          title="Needs Configuration"
          value={warningCols.length}
          variant="warning"
        />
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="analysis">Column Analysis</TabsTrigger>
            <TabsTrigger value="preview">Data Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="analysis" className="mt-4">
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
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px] w-full rounded-md border">
                <div className="w-max min-w-full">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-gray-50 font-semibold text-gray-700 shadow-sm">
                      <tr>
                        {preview?.columns.map((col) => (
                          <th key={col} className="border-b bg-gray-50 px-4 py-3 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {preview?.data.map((row, i) => (
                        <tr key={i} className="transition-colors hover:bg-gray-50">
                          {preview.columns.map((col) => (
                            <td key={col} className="max-w-[200px] truncate border-b px-4 py-2">
                              {row[col] !== null && row[col] !== undefined ? (
                                row[col].toString()
                              ) : (
                                <span className="text-gray-300 italic">null</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
