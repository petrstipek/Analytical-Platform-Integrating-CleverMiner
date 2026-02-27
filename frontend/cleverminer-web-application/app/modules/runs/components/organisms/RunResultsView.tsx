import { CheckCheck, Clock, List } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { DatasetSummaryCard } from '@/modules/datasets/components/atoms';
import { ProceduresType } from '@/shared/domain/procedures.type';
import {
  CfMinerResultsPanel,
  FourFtMinerResultsPanel,
  Sd4ftMinerResultsPanel,
  UicMinerResultsPanel,
} from '@/modules/runs/components/molecules/procedureResultsPanels';
import React from 'react';
import type { RunWithTask } from '@/modules/runs/domain/runs-main.type';
import BaseSummaryCard from '@/shared/components/atoms/BaseSummaryCard';

export default function RunResultsView({ runResult }: { runResult: RunWithTask }) {
  if (!runResult.result) return <div>No results found.</div>;

  const header = (
    <div className="grid gap-4 md:grid-cols-3">
      <BaseSummaryCard
        title="Status"
        value="Successfuly Completed"
        variant="success"
        icon={<CheckCheck className="h-4 w-4" />}
      />
      <BaseSummaryCard
        title="Rules Found"
        value={runResult.result.summary.rule_count}
        variant="default"
        icon={<List className="h-4 w-4" />}
      />
      <BaseSummaryCard
        title="Execution Time"
        value={formatDistance(new Date(runResult.finished_at), new Date(runResult.started_at))}
        variant="default"
        icon={<Clock className="h-4 w-4" />}
      />
    </div>
  );

  function createPanel(panel: React.ReactNode) {
    return (
      <div className="animate-in fade-in space-y-6 duration-500">
        {header}
        {panel}
      </div>
    );
  }

  switch (runResult.task.procedure) {
    case ProceduresType.FOURFTMINER:
      return createPanel(<FourFtMinerResultsPanel task={runResult as any} />);

    case ProceduresType.SD4FTMINER:
      return createPanel(<Sd4ftMinerResultsPanel task={runResult as any} />);

    case ProceduresType.CFMINER:
      return createPanel(<CfMinerResultsPanel task={runResult as any} />);

    case ProceduresType.UICMINER:
      return createPanel(<UicMinerResultsPanel task={runResult as any} />);

    default:
      return <div>Unsupported procedure</div>;
  }
}
