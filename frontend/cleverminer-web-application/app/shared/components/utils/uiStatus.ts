type TaskStatus = 'progress' | 'completed' | 'todo';

export const TASK_STATUS_BADGE_CLASS: Record<TaskStatus, string> = {
  todo: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  progress: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
};
