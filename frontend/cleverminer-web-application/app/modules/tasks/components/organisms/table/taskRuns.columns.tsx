import type { ColumnDef } from '@tanstack/react-table';
import type { TaskRun } from '@/modules/tasks/domain/task-run.type';
import { formatDate } from '@/shared/utils/formatDate';
import { RunAchievedResultBadge } from '@/modules/runs/components/atoms/RunAchievedResultBadge';
import { RunStatusBadge } from '@/modules/runs/components/atoms/RunStatusBadge';
import { ElapsedCell } from '@/shared/components/atoms';
import { ErrorLogCell } from '@/modules/tasks/components/molecules';

export const TaskRunsColumns: ColumnDef<TaskRun>[] = [
  {
    accessorKey: 'id',
    header: 'Run id',
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
    accessorKey: 'finished_at',
    header: 'Finished At',
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
  {
    id: 'elapsed',
    header: 'Elapsed',
    cell: ({ row }) => <ElapsedCell row={row.original} />,
  },
  {
    accessorKey: 'result_summary.has_result',
    header: 'Achieved Result',
    cell: ({ row }) => (
      <RunAchievedResultBadge status={row.original?.result_summary?.has_result!} />
    ),
  },
  { accessorKey: 'result_summary.rule_count', header: 'Found Rules' },
  {
    id: 'error_log',
    accessorKey: 'error_log',
    header: 'Error',
    cell: ({ row }) =>
      row.original.error_log ? <ErrorLogCell errorLog={row.original.error_log} /> : null,
  },
];
