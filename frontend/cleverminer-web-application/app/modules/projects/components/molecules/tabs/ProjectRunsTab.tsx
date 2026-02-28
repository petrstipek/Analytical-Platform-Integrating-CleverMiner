import { DataTable } from '@/shared/components/organisms/table/data-table';
import { getBaseRunColumns } from '@/modules/runs/components/organisms/table/runs.columns';
import type { RunResult } from '@/modules/runs/domain/runs-results.type';
import { useNavigate } from 'react-router';
import { PlatformCard } from '@/shared/components/molecules';

type ProjectRunsTabProps = {
  runs: RunResult[];
};

export default function ProjectRunsTab({ runs }: ProjectRunsTabProps) {
  const navigate = useNavigate();

  const RunsBaseColumns = getBaseRunColumns((runId: number) => {});

  return (
    <PlatformCard cardTitle={'Project Runs'} cardDescription={'Explore project runs.'}>
      <DataTable
        columns={RunsBaseColumns}
        data={runs}
        onRowClick={(row) => navigate(`/run/${row.id}`)}
      />
    </PlatformCard>
  );
}
