import type { ProjectRole } from '@/modules/projects/domain/project.type';

export type AddProjectMemberType = {
  projectId: number;
  email: string;
  role: ProjectRole;
};

export type ProjectSummary = {
  runs: number;
  tasks: number;
  datasets: number;
};
