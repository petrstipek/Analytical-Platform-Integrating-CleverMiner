import { useState } from 'react';
import { Clock, CheckCheck, List } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Card, CardContent } from '@/shared/components/ui/molecules/card';
import { RulesList, FourfoldTable, RuleCharts } from '../molecules';
import { DatasetSummaryCard } from '@/modules/datasets/components/atoms';
import type { RunResult, RunResultRule } from '@/modules/runs/domain/runs-results.type';

export default function RunResultsView({ task }: { task: RunResult }) {
  const [selectedRule, setSelectedRule] = useState<RunResultRule | null>(
    task.result?.rules[0] || null,
  );

  if (!task.result) return <div>No results found.</div>;

  const duration = formatDistance(new Date(task.finished_at), new Date(task.started_at));

  return (
    <div className="animate-in fade-in space-y-6 duration-500">
      <div className="grid gap-4 md:grid-cols-3">
        <DatasetSummaryCard
          title="Status"
          value="Completed"
          variant="success"
          icon={<CheckCheck className="h-4 w-4" />}
        />
        <DatasetSummaryCard
          title="Rules Found"
          value={task.result.summary.rule_count}
          variant="default"
          icon={<List className="h-4 w-4" />}
        />
        <DatasetSummaryCard
          title="Execution Time"
          value={duration}
          variant="default"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h3 className="text-lg font-semibold tracking-tight">Discovered Rules</h3>
          <RulesList
            rules={task.result.rules}
            selectedRuleId={selectedRule?.id || null}
            onSelectRule={setSelectedRule}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">Rule Details</h3>
          {selectedRule ? (
            <div className="sticky top-6 space-y-4">
              <RuleCharts fourfold={selectedRule.quantifiers.fourfold} />
              <FourfoldTable data={selectedRule.quantifiers.fourfold} />

              <Card>
                <CardContent className="space-y-2 pt-6">
                  <div className="flex justify-between border-b pb-2 text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-mono font-bold">
                      {(selectedRule.quantifiers.conf * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2 text-sm">
                    <span className="text-muted-foreground">Support (Base)</span>
                    <span className="font-mono">{selectedRule.quantifiers.base}</span>
                  </div>
                  <div className="flex justify-between pb-2 text-sm">
                    <span className="text-muted-foreground">Relative Base</span>
                    <span className="font-mono">
                      {(selectedRule.quantifiers.rel_base * 100).toFixed(2)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">Select a rule to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
