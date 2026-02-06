import { z } from 'zod';
import { ProjectRole } from '@/modules/projects/domain/project.type';

export const createProjectSchema = z.object({
  name: z.string().min(3, 'Task name must be at least 3 characters'),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export const addProjectMemberSchema = z.object({
  email: z.email(),
  role: z.enum([ProjectRole.admin, ProjectRole.editor]),
});

export type AddProjectMemberFormValues = z.infer<typeof addProjectMemberSchema>;
