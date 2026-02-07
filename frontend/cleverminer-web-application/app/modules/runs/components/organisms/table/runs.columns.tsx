import type { ColumnDef } from '@tanstack/react-table';
import type { RunResult } from '@/modules/runs/domain/runs-results.type';
import { formatDate } from '@/shared/utils/formatDate';
import { elapsed } from '@/modules/tasks/utils/time-calculations';
import { RunStatusBadge } from '@/modules/runs/components/atoms/RunStatusBadge';
import { RunAchievedResultBadge } from '@/modules/runs/components/atoms/RunAchievedResultBadge';

export const RunsColumns: ColumnDef<RunResult>[] = [
  {
    accessorKey: 'id',
    header: 'Run id',
  },
  {
    accessorKey: 'task_name',
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

export const RunsColumnsSummarized: ColumnDef<RunResult>[] = [
  { accessorKey: 'id', header: 'Run id' },
  {
    accessorKey: 'task_name',
    header: 'Task',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <RunStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'started_at',
    header: 'Started At',
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
  {
    id: 'elapsed',
    header: 'Elapsed',
    cell: ({ row }) => elapsed(row.original.started_at, row.original.finished_at),
  },

  {
    accessorKey: 'result_summary.has_result',
    header: 'Achieved Result',
    cell: ({ row }) => (
      <RunAchievedResultBadge status={row.original?.result_summary?.has_result!} />
    ),
  },
  { accessorKey: 'result_summary.rule_count', header: 'Found Rules' },
];
