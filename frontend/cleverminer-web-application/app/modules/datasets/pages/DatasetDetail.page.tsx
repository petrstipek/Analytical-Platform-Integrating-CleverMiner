import {
  DatasetAnalysisView,
  DatasetColumnsAnalysisView,
  DatasetDerivedList,
  DatasetPreview,
  DatasetProfile,
} from '@/modules/datasets/components/organisms';
import { useParams } from 'react-router';
import { DatasetDetailHeader } from '@/modules/datasets/components/molecules';
import { useDatasetAnalysis } from '@/modules/datasets/hooks/datasetAnalysis.hook';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/molecules/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { LoadingStatus, NotReadyStatus } from '@/shared/components/molecules';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/molecules/dialog';

export default function DatasetDetailPage() {
  const { datasetId } = useParams();

  const {
    clmCandidatesData,
    columnStatsData,
    datasetStatsOverview,
    datasetProfile,
    isAnalysing,
    error,
    isReady,
    datasetPreview,
  } = useDatasetAnalysis(Number(datasetId));

  if (!datasetId) return <div>No dataset ID provided.</div>;
  if (!isReady)
    return (
      <NotReadyStatus
        description={'The dataset will be soon available.'}
        hint={'You can leave this page and come back later. The dataset id is: ' + datasetId}
      />
    );
  if (isAnalysing)
    return (
      <LoadingStatus
        title={'Analyzing dataset...'}
        description={'Application is analyzing the dataset.'}
      />
    );
  if (error) return <div>Error loading dataset analysis.</div>;

  return (
    <Dialog>
      <div className="grid w-full grid-cols-1 gap-6">
        <DatasetDetailHeader datasetStatsOverview={datasetStatsOverview!} />

        <Tabs defaultValue="datasetProfile" className="w-full">
          <div className="flex items-end justify-between">
            <TabsList className="bg-muted w-full rounded-full p-1">
              <TabsTrigger value="datasetProfile" className="flex-1">
                <span className="bg-cleverminer-one flex h-5 w-5 items-center justify-center rounded-full border text-xs text-white">
                  1
                </span>
                Exploratory Data Analysis
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1">
                <span className="bg-cleverminer-one flex h-5 w-5 items-center justify-center rounded-full border text-xs text-white">
                  2
                </span>
                Data Preview
              </TabsTrigger>
              <TabsTrigger value="clmGuidance" className="flex-1">
                <span className="bg-cleverminer-one flex h-5 w-5 items-center justify-center rounded-full border text-xs text-white">
                  3
                </span>
                CleverMiner Guidance
              </TabsTrigger>
              <TabsTrigger value="ColumnsAnalysis" className="flex-1">
                <span className="bg-cleverminer-one flex h-5 w-5 items-center justify-center rounded-full border text-xs text-white">
                  4
                </span>
                Columns Analysis and Preprocessing
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
            <DatasetPreview preview={datasetPreview!} />
          </TabsContent>

          <TabsContent
            value="clmGuidance"
            className="animate-in fade-in slide-in-from-bottom-4 mt-4 duration-500"
          >
            <DatasetAnalysisView datasetId={Number(datasetId)} clmGuidance={clmCandidatesData!} />
          </TabsContent>

          <TabsContent
            value="ColumnsAnalysis"
            className="animate-in fade-in slide-in-from-bottom-4 mt-4 duration-500"
          >
            <DatasetColumnsAnalysisView columnsAnalysis={columnStatsData!} datasetId={datasetId!} />
          </TabsContent>
        </Tabs>

        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Dataset Transformations</DialogTitle>
            <DialogDescription>
              Explore the transformations carried out on this dataset.
            </DialogDescription>
          </DialogHeader>
          <DatasetDerivedList datasetId={datasetId} />
        </DialogContent>
      </div>
    </Dialog>
  );
}
