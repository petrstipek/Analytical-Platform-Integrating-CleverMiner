import type { ProjectType } from '@/modules/projects/domain/project.type';
import type { Member } from '@/modules/projects/domain/member.type';
import type { TaskType } from '@/modules/projects/domain/task.type';

export const PROJECT: ProjectType = {
  title: 'First cleverminer project',
  description: 'trying different rules for the cleverminer application.',
  status: true,
  totalTasks: 4,
  completedTasks: 2,
};

export const TEAM: Member[] = [
  {
    name: 'Sarah Johnson',
    role: 'admin',
  },
  {
    name: 'Mike Chen',
    role: 'editor',
  },
  { name: 'Emma Davis', role: 'editor' },
  {
    name: 'Alex Rodriguez',
    role: 'viewer',
  },
];

export const TASKS: TaskType[] = [
  {
    id: 1,
    title: 'cleverminer task 1',
    description: 'sd4ftminer',
    status: 'todo',
    completed: false,
  },
  {
    id: 2,
    title: 'cleverminer task 2',
    description: 'cf miner',
    status: 'progress',
    completed: false,
  },
  {
    id: 3,
    title: 'cleverminer task 3',
    description: '4ft tminer',
    status: 'completed',
    completed: false,
  },
];
