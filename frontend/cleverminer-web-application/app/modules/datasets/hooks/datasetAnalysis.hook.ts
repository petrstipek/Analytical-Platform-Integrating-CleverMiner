import { useQuery } from '@tanstack/react-query';
import {
  getDatasetAnalysis,
  getDatasetAnalysisStats,
  getDatasetPreview,
  getDatasetProfile,
  getDatasetStatsOverview,
} from '../api/dataset-analysis.api';
import { toast } from 'sonner';

export function useDatasetPreview(id: number | null) {
  return useQuery({
    queryKey: ['dataset-preview', id],
    queryFn: () => getDatasetPreview(id!),
    enabled: !!id,
  });
}

export function useDatasetAnalysis(id: number | null) {
  const {
    data: clmCandidatesData,
    isLoading: clmCandidatesLoading,
    error: clmCandidatesError,
  } = useQuery({
    queryKey: ['dataset-analysis', id],
    queryFn: () => getDatasetAnalysis(id!),
    enabled: !!id,
  });

  const {
    data: columnStatsData,
    isLoading: columnStatsLoading,
    error: columnStatsError,
  } = useQuery({
    queryKey: ['dataset-column-stats', id],
    queryFn: () => getDatasetAnalysisStats(id!),
    enabled: !!id,
  });

  const {
    data: datasetStatsOverview,
    isLoading: datasetStatsOverviewLoading,
    error: datasetStatsOverviewError,
  } = useQuery({
    queryKey: ['dataset-stats-overview', id],
    queryFn: () => getDatasetStatsOverview(id!),
    enabled: !!id,
  });

  const {
    data: datasetProfile,
    isLoading: datasetProfileLoading,
    error: datasetProfileError,
  } = useQuery({
    queryKey: ['dataset-profile', id],
    queryFn: () => getDatasetProfile(id!),
    enabled: !!id,
  });

  const error =
    clmCandidatesError || columnStatsError || datasetStatsOverviewError || datasetProfileError;
  const isAnalysing =
    clmCandidatesLoading ||
    columnStatsLoading ||
    datasetStatsOverviewLoading ||
    datasetProfileLoading;

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
  };
}
