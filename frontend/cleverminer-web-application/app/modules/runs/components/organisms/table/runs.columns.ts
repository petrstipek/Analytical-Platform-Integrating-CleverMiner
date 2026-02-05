import type { ColumnDef } from '@tanstack/react-table';
import type { RunResult } from '@/modules/runs/domain/runs-results.type';
import { formatDate } from '@/shared/utils/formatDate';

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
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
  {
    accessorKey: 'started_at',
    header: 'Started At',
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
  {
    accessorKey: 'finished_at',
    header: 'Finished At',
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
  { accessorKey: 'result_summary.has_result', header: 'Achieved Result' },
  { accessorKey: 'result_summary.rule_count', header: 'Found Rules' },
];
