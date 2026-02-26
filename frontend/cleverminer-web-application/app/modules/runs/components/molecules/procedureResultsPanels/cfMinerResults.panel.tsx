import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/molecules/card';
import { DiscoveredRulesContainer, HistogramBars } from '@/modules/runs/components/molecules';
import type { RunResultCf } from '@/modules/runs/domain/runs-results.type';
import type { RuleListRow } from '@/modules/runs/components/molecules/RulesList';
import { CFMinerDetails } from '@/modules/tasks/components/organisms/procedures';
import { ProceduresType } from '@/shared/domain/procedures.type';
import RunConfigurationDetails from '@/modules/runs/components/molecules/RunConfigurationDetails';

export default function CfMinerResultsPanel({ task }: { task: RunResultCf }) {
  const categories = task.result.summary.categories ?? [];
  const target = task.result.summary.target;

  const listRules: RuleListRow[] = useMemo(
    () =>
      task.result.rules.map((r) => ({
        id: r.id,
        text: r.text,
        metrics: { base: r.quantifiers.base },
      })),
    [task.result.rules],
  );

  const [selectedId, setSelectedId] = useState<number | null>(listRules[0]?.id ?? null);
  const selectedRule = task.result.rules.find((r) => r.id === selectedId) ?? null;

  return (
    <div>
      <RunConfigurationDetails procedure={ProceduresType.CFMINER}>
        <CFMinerDetails params={task.run_snapshot} />
      </RunConfigurationDetails>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DiscoveredRulesContainer
          rules={listRules}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">Rule Detail</CardTitle>
              <CardDescription>Find more about selected rule.</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedRule ? (
                <div className="sticky top-6 space-y-4">
                  <Card>
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
                    title="Histogram (Rule)"
                    categories={categories}
                    values={selectedRule.quantifiers.hist}
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
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">Select a rule to view details</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
