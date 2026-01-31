import type { RunResultTyped } from '@/modules/runs/domain/runs-results.type';
import type { Task } from '@/modules/tasks/domain/task.type';

export type RunWithTask = RunResultTyped & { task: Task };
