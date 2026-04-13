import { useQuery } from '@tanstack/react-query';
import {
  getDatasetAnalysis,
  getDatasetAnalysisStats,
  getDatasetPreview,
  getDatasetProfile,
  getDatasetStatsOverview,
} from '../api/dataset-analysis.api';
import { toast } from 'sonner';
import { getDataset } from '@/modules/datasets/api/datasets.api';

export function useDatasetAnalysis(id: number | null) {
  const { data: dataset, isLoading: datasetLoading } = useQuery({
    queryKey: ['dataset', id],
    queryFn: () => getDataset(id!),
    enabled: !!id,
    refetchInterval: (query) => (query.state.data?.is_ready ? false : 2000),
  });

  const isReady = dataset?.is_ready ?? false;

  const {
    data: datasetPreview,
    isLoading: previewLoading,
    error: previewError,
  } = useQuery({
    queryKey: ['dataset-preview', id],
    queryFn: () => getDatasetPreview(id!),
    enabled: !!id && isReady,
  });

  const {
    data: clmCandidatesData,
    isLoading: clmCandidatesLoading,
    error: clmCandidatesError,
  } = useQuery({
    queryKey: ['dataset-analysis', id],
    queryFn: () => getDatasetAnalysis(id!),
    enabled: !!id && isReady,
  });

  const {
    data: columnStatsData,
    isLoading: columnStatsLoading,
    error: columnStatsError,
  } = useQuery({
    queryKey: ['dataset-column-stats', id],
    queryFn: () => getDatasetAnalysisStats(id!),
    enabled: !!id && isReady,
  });

  const {
    data: datasetStatsOverview,
    isLoading: datasetStatsOverviewLoading,
    error: datasetStatsOverviewError,
  } = useQuery({
    queryKey: ['dataset-stats-overview', id],
    queryFn: () => getDatasetStatsOverview(id!),
    enabled: !!id && isReady,
  });

  const {
    data: datasetProfile,
    isLoading: datasetProfileLoading,
    error: datasetProfileError,
  } = useQuery({
    queryKey: ['dataset-profile', id],
    queryFn: () => getDatasetProfile(id!),
    enabled: !!id && isReady,
  });

  const error =
    clmCandidatesError ||
    columnStatsError ||
    datasetStatsOverviewError ||
    datasetProfileError ||
    previewError;

  const isAnalysing =
    clmCandidatesLoading ||
    columnStatsLoading ||
    datasetStatsOverviewLoading ||
    datasetProfileLoading ||
    previewLoading;

  if (error) {
    console.error('Failed to fetch dataset analysis:', clmCandidatesError, columnStatsError);
    toast.error('Failed to fetch dataset analysis' + columnStatsData + columnStatsError);
  }

  return {
    clmCandidatesData,
    columnStatsData,
    datasetStatsOverview,
    datasetProfile,
    isAnalysing,
    error,
    isReady,
    datasetPreview,
  };
}
