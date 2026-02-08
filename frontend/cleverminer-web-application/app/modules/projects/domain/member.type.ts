import type { ProjectRole } from '@/modules/projects/domain/project.type';

type Role = 'admin' | 'editor' | 'viewer';

export type Member = {
  name: string;
  role: Role;
};

export type ProjectMember = {
  userId: number;
  email: string;
  username: string;
  role: ProjectRole;
  createdAt: Date;
};
