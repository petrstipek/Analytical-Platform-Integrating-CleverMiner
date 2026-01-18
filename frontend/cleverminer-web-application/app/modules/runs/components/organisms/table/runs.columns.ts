import type { ColumnDef } from '@tanstack/react-table';
import type { RunResult } from '@/modules/runs/domain/runs-results.type';

export const RunsColumns: ColumnDef<RunResult>[] = [
  {
    accessorKey: 'id',
    header: 'Run id',
  },
  {
    accessorKey: 'task',
    header: 'Task',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  { accessorKey: 'created_at', header: 'Created At' },
  {
    accessorKey: 'started_at',
    header: 'Started At',
  },
  { accessorKey: 'finished_at', header: 'Finished At' },
  { accessorKey: 'result_summary.has_result', header: 'Achieved Result' },
  { accessorKey: 'result_summary.rule_count', header: 'Found Rules' },
];
