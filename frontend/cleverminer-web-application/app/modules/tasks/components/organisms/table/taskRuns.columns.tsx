import type { ColumnDef } from '@tanstack/react-table';
import type { TaskRun } from '@/modules/tasks/domain/task-run.type';

export const TaskRunsColumns: ColumnDef<TaskRun>[] = [
  {
    accessorKey: 'id',
    header: 'Run id',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'started_at',
    header: 'Started At',
  },
  { accessorKey: 'finished_at', header: 'Finished At' },
  { accessorKey: 'result_summary.has_result', header: 'Achieved Result' },
  { accessorKey: 'result_summary.rule_count', header: 'Found Rules' },
];
