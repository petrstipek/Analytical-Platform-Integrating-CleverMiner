import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/molecules/card';
import { HistogramBars, RulesList } from '@/modules/runs/components/molecules';
import type { RunResultUic } from '@/modules/runs/domain/runs-results.type';
import type { RuleListRow } from '@/modules/runs/components/molecules/RulesList';

export default function UicMinerResultsPanel({ task }: { task: RunResultUic }) {
  const categories = task.result.summary.categories ?? [];
  const target = task.result.summary.target;

  const listRules: RuleListRow[] = useMemo(
    () => task.result.rules.map((r) => ({ id: r.id, text: r.text })),
    [task.result.rules],
  );

  const [selectedId, setSelectedId] = useState<number | null>(listRules[0]?.id ?? null);
  const selectedRule = task.result.rules.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h3 className="text-lg font-semibold tracking-tight">Discovered Rules</h3>
        <RulesList
          rules={listRules}
          selectedRuleId={selectedId}
          onSelectRule={(row) => setSelectedId(row.id)}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">Rule Details</h3>

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
              values={selectedRule.histogram_rule}
            />

            <HistogramBars
              title="Histogram (Background)"
              categories={categories}
              values={selectedRule.histogram_background}
            />
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">Select a rule to view details</div>
        )}
      </div>
    </div>
  );
}
