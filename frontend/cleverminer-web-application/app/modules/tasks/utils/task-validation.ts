import { z } from 'zod';

const attributeSchema = z
  .object({
    name: z.string().min(1, 'Column name is required'),
    attr_type: z.enum(['subset', 'lcut', 'rcut', 'seq', 'one']),
    minlen: z.number().min(1),
    maxlen: z.number().min(1),
    gace: z.enum(['positive', 'negative', 'both']),
  })
  .refine((data) => data.minlen <= data.maxlen, {
    message: 'Min length cannot be greater than Max length',
    path: ['minlen'],
  });

const cedentSchema = z.object({
  type: z.enum(['con', 'dis']),
  minlen: z.number().min(1),
  maxlen: z.number().min(1),
  attributes: z.array(attributeSchema),
});

const quantifiersSchema = z.record(
  z.string(),
  z.union([z.number(), z.array(z.number()), z.null()]),
);

const optionsSchema = z.object({
  no_optimizations: z.boolean().optional(),
  max_categories: z.number().nullable().optional(),
});

export const createTaskSchema = z.object({
  name: z.string().min(3, 'Task name must be at least 3 characters'),
  dataset: z.number().min(1, { message: 'Please select a dataset' }),
  procedure: z.string(),
  configuration: z.object({
    ante: cedentSchema.optional(),
    succ: cedentSchema.optional(),
    cond: cedentSchema.nullable().optional(),

    set1: cedentSchema.optional(),
    set2: cedentSchema.optional(),

    target: z.string().optional(),

    quantifiers: quantifiersSchema,
    opts: optionsSchema.optional(),
  }),
});

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
