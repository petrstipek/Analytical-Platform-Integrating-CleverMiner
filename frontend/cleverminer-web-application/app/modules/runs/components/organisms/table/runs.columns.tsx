import type { ColumnDef } from '@tanstack/react-table';
import type { RunResult } from '@/modules/runs/domain/runs-results.type';
import { formatDate } from '@/shared/utils/formatDate';
import { elapsed } from '@/modules/tasks/utils/time-calculations';
import { RunStatusBadge } from '@/modules/runs/components/atoms/RunStatusBadge';
import { RunAchievedResultBadge } from '@/modules/runs/components/atoms/RunAchievedResultBadge';
import { Button } from '@/shared/components/ui/atoms/button';
import { Trash2 } from 'lucide-react';

export const RunsRunningColumns: ColumnDef<RunResult>[] = [
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

export const getBaseRunColumns = (onDelete: (id: number) => void): ColumnDef<RunResult>[] => [
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
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      if (!row.original?.finished_at) return <div>Cannot delete not finished run!</div>;
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
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];
