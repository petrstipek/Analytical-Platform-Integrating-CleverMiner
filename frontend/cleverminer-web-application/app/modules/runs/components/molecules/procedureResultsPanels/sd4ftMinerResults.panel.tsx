import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/molecules/card';
import { FourfoldTable, RulesList } from '@/modules/runs/components/molecules';
import type { RunResultSd4ft } from '@/modules/runs/domain/runs-results.type';
import type { RuleListRow } from '@/modules/runs/components/molecules/RulesList';
import { KeyValueCard } from '@/modules/runs/components/atoms';

export default function Sd4ftMinerResultsPanel({ task }: { task: RunResultSd4ft }) {
  const listRules: RuleListRow[] = useMemo(
    () =>
      task.result.rules.map((r) => ({
        id: r.id,
        text: r.text,
        metrics: { confidence: r.quantifiers.conf1, base: r.quantifiers.base1 },
      })),
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
              <CardContent className="space-y-2">
                <div className="text-sm font-medium">Fourfold table (group 1)</div>
                <FourfoldTable data={selectedRule.quantifiers.fourfold1} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-2">
                <div className="text-sm font-medium">Fourfold table (group 2)</div>
                <FourfoldTable data={selectedRule.quantifiers.fourfold2} />
              </CardContent>
            </Card>

            <KeyValueCard
              rows={[
                {
                  label: 'Confidence 1',
                  value: `${(selectedRule.quantifiers.conf1 * 100).toFixed(2)}%`,
                },
                {
                  label: 'Confidence 2',
                  value: `${(selectedRule.quantifiers.conf2 * 100).toFixed(2)}%`,
                },
                {
                  label: 'Delta Confidence',
                  value: `${(selectedRule.quantifiers.deltaconf * 100).toFixed(2)}%`,
                },
                { label: 'Ratio Confidence', value: selectedRule.quantifiers.ratioconf.toFixed(3) },
                { label: 'Base 1', value: selectedRule.quantifiers.base1 },
                {
                  label: 'Relative Base 1',
                  value: `${(selectedRule.quantifiers.rel_base1 * 100).toFixed(2)}%`,
                },
                { label: 'Base 2', value: selectedRule.quantifiers.base2 },
                {
                  label: 'Relative Base 2',
                  value: `${(selectedRule.quantifiers.rel_base2 * 100).toFixed(2)}%`,
                },
              ]}
            />
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">Select a rule to view details</div>
        )}
      </div>
    </div>
  );
}
