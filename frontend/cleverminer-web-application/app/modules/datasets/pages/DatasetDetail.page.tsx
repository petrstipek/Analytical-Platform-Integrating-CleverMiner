import {
  DatasetAnalysisView,
  DatasetColumnsAnalysisView,
  DatasetPreview,
} from '@/modules/datasets/components/organisms';
import { useParams } from 'react-router';
import { DatasetDetailHeader } from '@/modules/datasets/components/molecules';
import {
  useDatasetAnalysis,
  useDatasetPreview,
} from '@/modules/datasets/hooks/datasetAnalysis.hook';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/molecules/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { LoadingStatus } from '@/shared/components/molecules';

export default function DatasetDetailPage() {
  const { datasetId } = useParams();

  const { clmCandidatesData, columnStatsData, datasetStatsOverview, isAnalysing, error } =
    useDatasetAnalysis(Number(datasetId));
  const {
    data: preview,
    isLoading: previewLoading,
    error: previewError,
  } = useDatasetPreview(Number(datasetId));

  const loading = isAnalysing || previewLoading;
  const mainError = error || previewError;

  if (loading) return <LoadingStatus />;
  if (mainError) return <div>Error loading dataset analysis.</div>;

  return (
    <div className="grid w-full grid-cols-1 gap-6">
      <DatasetDetailHeader datasetStatsOverview={datasetStatsOverview!} />

      <Tabs defaultValue="ColumnsAnalysis" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="ColumnsAnalysis">Columns Analysis</TabsTrigger>
            <TabsTrigger value="clmGuidance">CleverMiner Guidance</TabsTrigger>
            <TabsTrigger value="preview">Data Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="ColumnsAnalysis" className="mt-4">
          <DatasetColumnsAnalysisView columnsAnalysis={columnStatsData!} datasetId={datasetId!} />
        </TabsContent>

        <TabsContent value="clmGuidance" className="mt-4">
          <DatasetAnalysisView datasetId={Number(datasetId)} clmGuidance={clmCandidatesData!} />
        </TabsContent>

        <TabsContent value="preview" className="mt-4 w-full">
          <div className="w-full overflow-hidden">
            <DatasetPreview preview={preview!} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
