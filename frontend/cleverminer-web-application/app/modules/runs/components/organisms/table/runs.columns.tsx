import type { ColumnDef } from '@tanstack/react-table';
import { type RunResult, RunResultStatus } from '@/modules/runs/domain/runs-results.type';
import { formatDate } from '@/shared/utils/formatDate';
import { RunStatusBadge } from '@/modules/runs/components/atoms/RunStatusBadge';
import { RunAchievedResultBadge } from '@/modules/runs/components/atoms/RunAchievedResultBadge';
import { Button } from '@/shared/components/ui/atoms/button';
import { ArrowUpDown, Trash2 } from 'lucide-react';
import { PROCEDURE_STYLES } from '@/shared/components/styles/procedures-styling';
import { PROCEDURE_LABELS } from '@/shared/domain/procedures.type';

export const RunsRunningColumns: ColumnDef<RunResult>[] = [
  { accessorKey: 'id', header: 'Run id' },
  {
    accessorKey: 'task_name',
    header: 'Task',
  },
  {
    accessorKey: 'procedure',
    header: 'Procedure',
    cell: ({ getValue }) => {
      const procedure = getValue<RunResult['procedure']>();
      const styles = PROCEDURE_STYLES[procedure];

      return (
        <span
          className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${styles.bg} ${styles.text}`}
        >
          <span>{PROCEDURE_LABELS[procedure]}</span>
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <RunStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'started_at',
    cell: ({ getValue }) => formatDate(getValue<string>()),
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
  },
  {
    accessorKey: 'result_summary.procedure',
    header: 'Achieved Result',
    cell: ({ row }) => (
      <RunAchievedResultBadge status={row.original?.result_summary?.rule_count! > 0} />
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
    accessorKey: 'procedure',
    header: 'Procedure',
    cell: ({ getValue }) => {
      const procedure = getValue<RunResult['procedure']>();
      const styles = PROCEDURE_STYLES[procedure];

      return (
        <span
          className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${styles.bg} ${styles.text}`}
        >
          <span>{PROCEDURE_LABELS[procedure]}</span>
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <RunStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'started_at',
    cell: ({ getValue }) => formatDate(getValue<string>()),
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
  },
  {
    accessorKey: 'result_summary.procedure',
    header: 'Achieved Result',
    cell: ({ row }) => (
      <RunAchievedResultBadge status={row.original?.result_summary?.rule_count! > 0} />
    ),
  },
  { accessorKey: 'result_summary.rule_count', header: 'Found Rules' },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      console.log(row.original.status);
      if ([RunResultStatus.Queued, RunResultStatus.Running].includes(row.original?.status))
        return <div>Cannot delete not finished run!</div>;
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
