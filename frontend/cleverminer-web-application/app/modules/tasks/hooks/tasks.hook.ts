import { useMutation } from '@tanstack/react-query';
import { createTask, createAndExecuteTask } from '../api/tasks.api';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function useCreateTaskMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: any) => {
      const task = await createTask(data);
      await createAndExecuteTask(task.id);
      return task;
    },
    onSuccess: (task) => {
      toast.success(`Task "${task.name}" created and started!`);
      navigate(`/tasks/${task.id}`);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error('Failed to create task: ' + (error.response?.data?.detail || error.message));
      alert('Error: ' + (error.response?.data?.detail || 'Something went wrong'));
    },
  });
}
