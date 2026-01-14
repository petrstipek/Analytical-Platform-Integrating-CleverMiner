import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadDataset, type UploadDatasetPayload } from '../api/datasets.api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

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
