import type { ColumnDef } from '@tanstack/react-table';
import type { TaskRun } from '@/modules/tasks/domain/task-run.type';
import { formatDate } from '@/shared/utils/formatDate';
import { RunAchievedResultBadge } from '@/modules/runs/components/atoms/RunAchievedResultBadge';
import { RunStatusBadge } from '@/modules/runs/components/atoms/RunStatusBadge';
import { ElapsedCell } from '@/shared/components/atoms';
import { ErrorLogCell } from '@/modules/tasks/components/molecules';
import { RunResultStatus } from '@/modules/runs/domain/runs-results.type';
import { Button } from '@/shared/components/ui/atoms/button';
import { ArrowUpDown, Square, Trash2 } from 'lucide-react';

export const getTaskRunsColumns = (
  onDelete: (id: number) => void,
  onStop?: (id: number) => void,
): ColumnDef<TaskRun>[] => [
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Started At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
      <RunAchievedResultBadge status={row.original?.result_summary?.rule_count! > 0} />
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
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const isActive = [RunResultStatus.Queued, RunResultStatus.Running].includes(
        row.original?.status,
      );

      if (isActive) {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-500 hover:bg-amber-50 hover:text-amber-700"
            onClick={(e) => {
              e.stopPropagation();
              onStop?.(row.original.id);
            }}
          >
            Stop
            <Square className="h-4 w-4" />
          </Button>
        );
      }

      return (
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:bg-red-50 hover:text-red-700"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(row.original.id);
          }}
        >
          {' '}
          Delete
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];
