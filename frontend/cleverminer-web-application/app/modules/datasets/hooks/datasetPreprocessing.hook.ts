import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchColumnVisibility } from '@/modules/datasets/api/dataset-analysis.api';
import { toast } from 'sonner';

export function useDatasetPreprocessing(datasetId: number) {
  const queryClient = useQueryClient();

  const {
    mutate: patchColumnVisibilityMutation,
    isPending: patchColumnVisibilityPending,
    data: patchColumnVisibilityData,
  } = useMutation({
    mutationFn: ({ column, visible }: { column: string; visible: boolean }) =>
      patchColumnVisibility(datasetId, column, visible),
    onSuccess: () => {
      console.log('Column visibility updated successfully!');
      toast.success('Column visibility updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['dataset-column-stats', datasetId] });
    },
    onError: (error: any) => {
      console.error('Error updating column visibility:', error);
      toast.error('Error updating column visibility: ' + (error.response?.data?.detail || ''));
    },
  });

  return {
    columnVisibilityAction: {
      mutation: patchColumnVisibilityMutation,
      isPending: patchColumnVisibilityPending,
      data: patchColumnVisibilityData,
    },
  };
}
