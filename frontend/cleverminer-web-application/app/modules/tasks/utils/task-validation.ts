import { z } from 'zod';
import { ProceduresType } from '@/shared/domain/procedures.type';

const attributeSchema = z
  .object({
    name: z.string().min(1, 'Column name is required'),
    attr_type: z.enum(['subset', 'lcut', 'rcut', 'seq', 'one']),
    minlen: z.number().min(1).optional(),
    maxlen: z.number().min(1).optional(),
    gace: z.enum(['positive', 'negative', 'both']),
    value: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.attr_type === 'one') {
      if (!data.value || data.value.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'A specific value is required for "one" type',
          path: ['value'],
        });
      }
    } else {
      if (data.minlen === undefined) {
        ctx.addIssue({
          code: 'custom',
          message: 'Min length is required',
          path: ['minlen'],
        });
      }
      if (data.maxlen === undefined) {
        ctx.addIssue({
          code: 'custom',
          message: 'Max length is required',
          path: ['maxlen'],
        });
      }
      if (data.minlen !== undefined && data.maxlen !== undefined && data.minlen > data.maxlen) {
        ctx.addIssue({
          code: 'custom',
          message: 'Min length cannot be greater than Max length',
          path: ['minlen'],
        });
      }
    }
  });

const cedentSchema = z
  .object({
    type: z.enum(['con', 'dis']),
    minlen: z.number().min(0, 'Min length cannot be negative'),
    maxlen: z.number().min(1, 'Max length must be at least 1'),
    attributes: z.array(attributeSchema),
  })
  .refine((data) => data.minlen <= data.maxlen, {
    message: 'Cedent Min length cannot be greater than Max length',
    path: ['minlen'],
  });

const quantifiersSchema = z.record(
  z.string(),
  z.union([z.number(), z.array(z.number()), z.null()]),
);

const optionsSchema = z.object({
  no_optimizations: z.boolean().optional(),
  max_categories: z.number().nullable().optional(),
});

export const createTaskSchema = z
  .object({
    name: z.string().min(3, 'Task name must be at least 3 characters'),
    dataset: z.number().min(1, { message: 'Please select a dataset' }),
    procedure: z.enum([
      ProceduresType.CFMINER,
      ProceduresType.SD4FTMINER,
      ProceduresType.UICMINER,
      ProceduresType.FOURFTMINER,
    ]),
    project: z.number().positive().optional(),
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
  })
  .superRefine((data, ctx) => {
    const { procedure, configuration } = data;

    const requireCedent = (key: 'ante' | 'succ' | 'set1' | 'set2' | 'cond', label: string) => {
      const cedent = configuration[key] as any;
      if (!cedent || cedent.attributes.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${label} requires at least one attribute`,
          path: ['configuration', key, 'attributes'],
        });
      }
    };

    switch (procedure) {
      case ProceduresType.FOURFTMINER:
        requireCedent('ante', 'Antecedent');
        requireCedent('succ', 'Succedent');
        break;
      case ProceduresType.SD4FTMINER:
        requireCedent('ante', 'Antecedent');
        requireCedent('succ', 'Succedent');
        requireCedent('set1', 'First Set');
        requireCedent('set2', 'Second Set');
        break;
      case ProceduresType.CFMINER:
        requireCedent('cond', 'Condition');
        break;
      case ProceduresType.UICMINER:
        requireCedent('ante', 'Antecedent');
        break;
    }
  });
export type CreateTaskFormValues = z.infer<typeof createTaskSchema>;
