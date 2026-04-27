import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/molecules/card';
import {
  DiscoveredRulesContainer,
  HistogramBars,
  RuleChartDialog,
  RuleDetail,
} from '@/modules/runs/components/molecules';
import type { RuleListRow } from '@/modules/runs/components/molecules/RulesList';
import { CFMinerDetails } from '@/modules/tasks/components/organisms/procedures';
import { ProceduresType } from '@/shared/domain/procedures.type';
import RunConfigurationDetails from '@/modules/runs/components/molecules/RunConfigurationDetails';
import { PROCEDURE_STYLES } from '@/shared/components/styles/procedures-styling';
import { useRuleChart } from '@/modules/runs/hooks/useRuleChart';
import type { CfRule } from '@/modules/runs/domain/procedures-results.type';
import type { RunWithTask } from '@/modules/runs/domain/runs-main.type';
import type { CfSummary } from '@/modules/runs/domain/procedure-summary.type';

export default function CfMinerResultsPanel({ task }: { task: RunWithTask }) {
  const rules = task.result.rules as CfRule[];

  const summary = task.result.summary as CfSummary;
  const categories = summary.categories ?? [];
  const target = summary.target;

  const listRules: RuleListRow[] = useMemo(
    () =>
      rules.map((r) => ({
        id: r.id,
        text: r.text,
        structure: r.structure,
        metrics: { base: r.quantifiers.base },
      })),
    [rules],
  );

  const [selectedId, setSelectedId] = useState<number | null>(listRules[0]?.id ?? null);
  const selectedRule = rules.find((r) => r.id === selectedId) ?? null;

  const { chartUrl, chartLoading, loadChart } = useRuleChart(task.id, selectedId);

  return (
    <div>
      <RunConfigurationDetails procedure={ProceduresType.CFMINER}>
        <CFMinerDetails params={task.run_snapshot} task={task.task} />
      </RunConfigurationDetails>
      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
        <DiscoveredRulesContainer
          rules={listRules}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          procedure={ProceduresType.CFMINER}
        />
        <RuleDetail>
          {selectedRule ? (
            <div className="sticky top-6 space-y-4">
              <Card className={'bg-background/80 rounded-2xl border shadow-xl ring-1 ring-black/5'}>
                <CardContent className="space-y-2 pt-6 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Target</span>
                    <span className="font-mono font-bold">{target}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-muted-foreground">Categories</span>
                    <span className="font-mono">{categories.join(', ') || '-'}</span>
                  </div>
                </CardContent>
              </Card>

              <HistogramBars
                title="Histogram (Selected Rule)"
                categories={categories}
                values={selectedRule.histogram}
                colorClass={PROCEDURE_STYLES[ProceduresType.CFMINER].bg_histogram}
              />
              <HistogramBars
                title="Histogram (Entire Dataset)"
                categories={categories}
                values={selectedRule.histogram_full}
                colorClass={PROCEDURE_STYLES[ProceduresType.CFMINER].bg_histogram}
              />

              <Card>
                <CardContent className="space-y-2 pt-6 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Base</span>
                    <span className="font-mono font-bold">{selectedRule.quantifiers.base}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Relative Base</span>
                    <span className="font-mono">
                      {(selectedRule.quantifiers.rel_base * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Min / Max</span>
                    <span className="font-mono">
                      {selectedRule.quantifiers.min} / {selectedRule.quantifiers.max}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-muted-foreground">Rel Min / Rel Max</span>
                    <span className="font-mono">
                      {(selectedRule.quantifiers.rel_min * 100).toFixed(2)}% /{' '}
                      {(selectedRule.quantifiers.rel_max * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Steps Up (consecutive)</span>
                    <span className="font-mono">{selectedRule.quantifiers.s_up}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Steps Down (consecutive)</span>
                    <span className="font-mono">{selectedRule.quantifiers.s_down}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Steps Up (any)</span>
                    <span className="font-mono">{selectedRule.quantifiers.s_any_up}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Steps Down (any)</span>
                    <span className="font-mono">{selectedRule.quantifiers.s_any_down}</span>
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
