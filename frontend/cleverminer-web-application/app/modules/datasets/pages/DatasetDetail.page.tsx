import { DatasetAnalysisView, DatasetPreview } from '@/modules/datasets/components/organisms';
import { useParams } from 'react-router';
import { DatasetDetailHeader } from '@/modules/datasets/components/molecules';
import {
  useDatasetAnalysis,
  useDatasetPreview,
} from '@/modules/datasets/hooks/datasetAnalysis.hook';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/molecules/tabs';
import { TabsContent } from '@radix-ui/react-tabs';

export default function DatasetDetailPage() {
  const { datasetId } = useParams();

  const { clmCandidatesData, columnStatsData, isAnalysing, error } = useDatasetAnalysis(
    Number(datasetId),
  );
  const {
    data: preview,
    isLoading: previewLoading,
    error: previewError,
  } = useDatasetPreview(Number(datasetId));

  const loading = isAnalysing || previewLoading;
  const mainError = error || previewError;

  if (loading) return <div>Loading...</div>;
  if (mainError) return <div>Error loading dataset analysis.</div>;

  console.log(columnStatsData);

  return (
    <div className="flex w-full max-w-full min-w-0 flex-col gap-6 overflow-hidden">
      <DatasetDetailHeader />

      <Tabs defaultValue="analysis" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="ColumnsAnalysis">Columns Analysis</TabsTrigger>
            <TabsTrigger value="clmGuidance">CleverMiner Guidance</TabsTrigger>
            <TabsTrigger value="preview">Data Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="clmGuidance" className="mt-4">
          <DatasetAnalysisView datasetId={Number(datasetId)} clmGuidance={clmCandidatesData!} />
        </TabsContent>

        <TabsContent value="preview" className="mt-4 w-full">
          <DatasetPreview preview={preview!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
