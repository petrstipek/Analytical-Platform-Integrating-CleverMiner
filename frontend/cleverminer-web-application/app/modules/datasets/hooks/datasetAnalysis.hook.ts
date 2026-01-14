import { useQuery } from '@tanstack/react-query';
import { getDatasetAnalysis, getDatasetPreview } from '../api/dataset-analysis.api';

export function useDatasetPreview(id: number | null) {
  return useQuery({
    queryKey: ['dataset-preview', id],
    queryFn: () => getDatasetPreview(id!),
    enabled: !!id,
  });
}

export function useDatasetAnalysis(id: number | null) {
  return useQuery({
    queryKey: ['dataset-analysis', id],
    queryFn: () => getDatasetAnalysis(id!),
    enabled: !!id,
  });
}
