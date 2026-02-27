import { DataTable } from '@/shared/components/organisms/table/data-table';
import { getBaseRunColumns } from '@/modules/runs/components/organisms/table/runs.columns';
import type { RunResult } from '@/modules/runs/domain/runs-results.type';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';

type ProjectRunsTabProps = {
  runs: RunResult[];
};

export default function ProjectRunsTab({ runs }: ProjectRunsTabProps) {
  const navigate = useNavigate();

  const RunsBaseColumns = getBaseRunColumns((runId: number) => {});

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Runs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataTable
          columns={RunsBaseColumns}
          data={runs}
          onRowClick={(row) => navigate(`/run/${row.id}`)}
        />
      </CardContent>
    </Card>
  );
}
