import { useQuery } from '@tanstack/react-query';
import {
  getDatasetAnalysis,
  getDatasetAnalysisStats,
  getDatasetPreview,
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

  const error = clmCandidatesError || columnStatsError;
  const isAnalysing = clmCandidatesLoading || columnStatsLoading;

  if (error) {
    console.error('Failed to fetch dataset analysis:', clmCandidatesError, columnStatsError);
    toast.error('Failed to fetch dataset analysis' + columnStatsData + columnStatsError);
  }

  return { clmCandidatesData, columnStatsData, isAnalysing, error };
}
