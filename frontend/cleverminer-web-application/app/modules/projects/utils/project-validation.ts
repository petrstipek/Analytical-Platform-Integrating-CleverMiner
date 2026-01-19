import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(3, 'Task name must be at least 3 characters'),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
