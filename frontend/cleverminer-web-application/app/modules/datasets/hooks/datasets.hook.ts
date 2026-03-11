import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadDataset } from '../api/datasets.api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import type { UploadDatasetPayload } from '@/modules/datasets/api/types/datasetBase.type';

export function useUploadDatasetMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: UploadDatasetPayload) => uploadDataset(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });

      navigate(`/datasets/${data.id}`);

      toast.success(`Dataset "${data.name}" uploaded successfully!`);
    },
    onError: (error: any) => {
      console.error('Upload failed:', error);
      const msg = error.response?.data?.detail || 'Failed to upload dataset.';
      toast.error(`Dataset not uploaded: ${msg}`);
    },
  });
}
