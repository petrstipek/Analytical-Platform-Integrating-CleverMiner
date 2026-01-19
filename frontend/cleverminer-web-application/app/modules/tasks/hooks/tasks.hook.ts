import { useMutation } from '@tanstack/react-query';
import { createTask, createAndExecuteTask, updateTask } from '../api/tasks.api';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function useCreateTaskAndRunMutation() {
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

export function useUpdateTaskMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ taskId, data }: { taskId: number; data: any }) => {
      return updateTask(taskId, data);
    },
    onSuccess: (task) => {
      toast.success(`Task "${task.name}" updated!`);
      navigate(`/tasks/${task.id}`);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error('Failed to update task: ' + (error.response?.data?.detail || error.message));
    },
  });
}

export function useCreateAndExecuteRunMutation() {
  return useMutation({
    mutationFn: async (taskId: number) => {
      await createAndExecuteTask(taskId);
    },
    onSuccess: () => {
      toast.success(`Run for task created and started!`);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error('Failed to update task: ' + (error.response?.data?.detail || error.message));
    },
  });
}

export function useCreateTaskMutation() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: any) => {
      const task = await createTask(data);
      return task;
    },
    onSuccess: (task) => {
      toast.success(`Task "${task.name}" created and saved!`);
      navigate(`/tasks/${task.id}`);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error('Failed to create task: ' + (error.response?.data?.detail || error.message));
      alert('Error: ' + (error.response?.data?.detail || 'Something went wrong'));
    },
  });
}
