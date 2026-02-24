import {
  DatasetAnalysisView,
  DatasetColumnsAnalysisView,
  DatasetPreview,
  DatasetProfile,
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

  const {
    clmCandidatesData,
    columnStatsData,
    datasetStatsOverview,
    datasetProfile,
    isAnalysing,
    error,
  } = useDatasetAnalysis(Number(datasetId));
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

      <Tabs defaultValue="datasetProfile" className="w-full">
        <div className="flex items-end justify-between">
          <TabsList className="bg-muted w-full rounded-full p-1">
            <TabsTrigger value="datasetProfile" className="flex-1">
              Exploratory Data Analysis
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              Data Preview
            </TabsTrigger>
            <TabsTrigger value="ColumnsAnalysis" className="flex-1">
              Columns Analysis
            </TabsTrigger>
            <TabsTrigger value="clmGuidance" className="flex-1">
              CleverMiner Guidance
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="datasetProfile"
          className="animate-in fade-in slide-in-from-bottom-4 mt-4 duration-500"
        >
          <DatasetProfile datasetProfileData={datasetProfile!} />
        </TabsContent>

        <TabsContent
          value="preview"
          className="animate-in fade-in slide-in-from-bottom-4 mt-4 duration-500"
        >
          <DatasetPreview preview={preview!} />
        </TabsContent>

        <TabsContent
          value="ColumnsAnalysis"
          className="animate-in fade-in slide-in-from-bottom-4 mt-4 duration-500"
        >
          <DatasetColumnsAnalysisView columnsAnalysis={columnStatsData!} datasetId={datasetId!} />
        </TabsContent>

        <TabsContent
          value="clmGuidance"
          className="animate-in fade-in slide-in-from-bottom-4 mt-4 duration-500"
        >
          <DatasetAnalysisView datasetId={Number(datasetId)} clmGuidance={clmCandidatesData!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
