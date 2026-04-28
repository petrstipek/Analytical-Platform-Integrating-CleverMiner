import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/molecules/card';
import {
  DiscoveredRulesContainer,
  FourfoldTable,
  RuleChartDialog,
  RuleCharts,
  RuleDetail,
} from '@/modules/runs/components/molecules';
import { type RuleListRow } from '@/modules/runs/components/molecules/RulesList';
import type { FourftRule } from '@/modules/runs/domain/procedures-results.type';
import RunConfigurationDetails from '@/modules/runs/components/molecules/RunConfigurationDetails';
import { FourFtMinerDetails } from '@/modules/tasks/components/organisms/procedures';
import { ProceduresType } from '@/shared/domain/procedures.type';
import { useRuleChart } from '@/modules/runs/hooks/useRuleChart';

export default function FourFtMinerResultsPanel({ task }: { task: any }) {
  const rules: FourftRule[] = task.result.rules;

  const listRules: RuleListRow[] = useMemo(
    () =>
      rules.map((r) => ({
        id: r.id,
        text: r.text,
        structure: r.structure,
        metrics: { confidence: r.quantifiers.conf, base: r.quantifiers.base },
      })),
    [rules],
  );

  const [selectedId, setSelectedId] = useState<number | null>(listRules[0]?.id ?? null);
  const selectedRule = rules.find((r) => r.id === selectedId) ?? null;

  const { chartUrl, chartLoading, loadChart } = useRuleChart(task.id, selectedId);

  return (
    <div>
      <RunConfigurationDetails procedure={ProceduresType.FOURFTMINER}>
        <FourFtMinerDetails params={task.run_snapshot} task={task.task} />
      </RunConfigurationDetails>
      <div className="my-6 grid grid-cols-1 items-stretch gap-6 lg:h-[90vh] lg:grid-cols-3">
        <DiscoveredRulesContainer
          rules={listRules}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          procedure={ProceduresType.FOURFTMINER}
        />
        <RuleDetail>
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
                  <div className="flex justify-between border-b pb-2 text-sm">
                    <span className="text-muted-foreground">Relative Base</span>
                    <span className="font-mono">
                      {(selectedRule.quantifiers.rel_base * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2 text-sm">
                    <span className="text-muted-foreground">AAD</span>
                    <span className="font-mono">
                      {(selectedRule.quantifiers.aad! * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between pb-2 text-sm">
                    <span className="text-muted-foreground">BAD</span>
                    <span className="font-mono">
                      {(selectedRule.quantifiers.bad! * 100).toFixed(2)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
              {selectedRule.chart_path && (
                <RuleChartDialog
                  ruleId={selectedRule.id}
                  chartUrl={chartUrl}
                  chartLoading={chartLoading}
                  onOpen={() => loadChart()}
                />
              )}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">Select a rule to view details</div>
          )}
        </RuleDetail>
      </div>
    </div>
  );
}
