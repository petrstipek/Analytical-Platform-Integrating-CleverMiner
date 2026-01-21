import { DataTable } from '@/shared/components/organisms/table/data-table';
import { RunsColumns } from '@/modules/runs/components/organisms/table/runs.columns';
import type { RunResult } from '@/modules/runs/domain/runs-results.type';
import { useNavigate } from 'react-router';

type ProjectRunsTabProps = {
  runs: RunResult[];
};

export default function ProjectRunsTab({ runs }: ProjectRunsTabProps) {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tasks</h3>
      </div>

      <DataTable
        columns={RunsColumns}
        data={runs}
        onRowClick={(row) => navigate(`/run/${row.id}`)}
      />
    </div>
  );
}
