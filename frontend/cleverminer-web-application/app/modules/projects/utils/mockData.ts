import type { ProjectType } from '@/modules/projects/domain/project.type';
import type { Member } from '@/modules/projects/domain/member.type';
import type { TaskType } from '@/modules/projects/domain/task.type';

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
