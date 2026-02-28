import { Braces, CheckCheck, Clock, Download, List } from 'lucide-react';
import { formatDistance } from 'date-fns';
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
import { collapseAllNested, darkStyles, defaultStyles, JsonView } from 'react-json-view-lite';
import type {
  RunResultCf,
  RunResultSd4ft,
  RunResultUic,
} from '@/modules/runs/domain/runs-results.type';
import 'react-json-view-lite/dist/index.css';
import { ModulePagesHeader } from '@/shared/components/molecules';
import { Button } from '@/shared/components/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/molecules/dialog';
import { PROCEDURE_STYLES } from '@/shared/components/styles/procedures-styling';
import { cn } from '@/lib/utils';

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

  const exportData = () => {
    const json = JSON.stringify(runResult, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${runResult.task.name}-${runResult.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  function createPanel(panel: React.ReactNode) {
    const procedure: ProceduresType = runResult.task.procedure;
    return (
      <Dialog>
        <div className="animate-in fade-in space-y-6 duration-500">
          <ModulePagesHeader
            title={'Run for - ' + runResult.task.name}
            description={'Explore the results of this run.'}
          >
            <DialogTrigger asChild>
              <Button
                className={cn(
                  'text-black',
                  PROCEDURE_STYLES[procedure].bg,
                  PROCEDURE_STYLES[procedure].bg_hover,
                )}
              >
                <Braces /> Show Raw Output
              </Button>
            </DialogTrigger>
            <Button variant="secondary" onClick={exportData}>
              <Download /> Export data
            </Button>
          </ModulePagesHeader>

          {header}
          {panel}

          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Raw Output</DialogTitle>
              <DialogDescription>Full JSON output for this run.</DialogDescription>
            </DialogHeader>
            <div className="text-4xs max-h-[60vh] overflow-auto rounded-md p-3">
              <JsonView
                data={runResult}
                style={defaultStyles}
                shouldExpandNode={collapseAllNested}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    );
  }

  switch (runResult.task.procedure) {
    case ProceduresType.FOURFTMINER:
      return createPanel(<FourFtMinerResultsPanel task={runResult as RunWithTask} />);

    case ProceduresType.SD4FTMINER:
      return createPanel(<Sd4ftMinerResultsPanel task={runResult as RunResultSd4ft} />);

    case ProceduresType.CFMINER:
      return createPanel(<CfMinerResultsPanel task={runResult as RunResultCf} />);

    case ProceduresType.UICMINER:
      return createPanel(<UicMinerResultsPanel task={runResult as RunResultUic} />);

    default:
      return <div>Unsupported procedure</div>;
  }
}
