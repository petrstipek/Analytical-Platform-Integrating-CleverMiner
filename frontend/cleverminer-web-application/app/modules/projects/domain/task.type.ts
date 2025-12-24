type TaskStatus = 'progress' | 'completed' | 'todo';

export type TaskType = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  completed: boolean;
};
