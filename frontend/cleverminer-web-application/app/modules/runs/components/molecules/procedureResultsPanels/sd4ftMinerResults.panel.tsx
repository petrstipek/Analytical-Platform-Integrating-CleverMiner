import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/molecules/card';
import {
  DiscoveredRulesContainer,
  FourfoldTable,
  RuleCharts,
  RuleDetail,
} from '@/modules/runs/components/molecules';
import type { RunResultSd4ft } from '@/modules/runs/domain/runs-results.type';
import type { RuleListRow } from '@/modules/runs/components/molecules/RulesList';
import { KeyValueCard } from '@/modules/runs/components/atoms';
import { SD4ftMinerDetails } from '@/modules/tasks/components/organisms/procedures';
import RunConfigurationDetails from '@/modules/runs/components/molecules/RunConfigurationDetails';
import { ProceduresType } from '@/shared/domain/procedures.type';
import { ConfidenceComparison } from '@/modules/runs/components/organisms';
import { getLabel } from '@/modules/runs/utils/getRuleLabel';

export default function Sd4ftMinerResultsPanel({ task }: { task: RunResultSd4ft }) {
  const listRules: RuleListRow[] = useMemo(
    () =>
      task.result.rules.map((r) => ({
        id: r.id,
        text: r.text,
        structure: r.structure,
        metrics: {
          ratioconf: r.quantifiers.ratioconf,
          base: r.quantifiers.base1,
        },
      })),
    [task.result.rules],
  );

  const [selectedId, setSelectedId] = useState<number | null>(listRules[0]?.id ?? null);
  const selectedRule = task.result.rules.find((r) => r.id === selectedId) ?? null;

  const label1 = selectedRule ? getLabel(selectedRule.structure?.frst) : '';
  const label2 = selectedRule ? getLabel(selectedRule.structure?.scnd) : '';

  return (
    <div>
      <RunConfigurationDetails procedure={ProceduresType.SD4FTMINER}>
        <SD4ftMinerDetails params={task.run_snapshot} />
      </RunConfigurationDetails>
      <div className="my-6 grid grid-cols-1 items-stretch gap-6 lg:h-[90vh] lg:grid-cols-3">
        <DiscoveredRulesContainer
          rules={listRules}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          procedure={ProceduresType.SD4FTMINER}
        />
        <RuleDetail>
          {selectedRule ? (
            <div className="top-6 space-y-4">
              <ConfidenceComparison
                fourfold1={selectedRule.quantifiers.fourfold1}
                fourfold2={selectedRule.quantifiers.fourfold2}
                label1={label1}
                label2={label2}
              />
              <div className="grid grid-cols-2 gap-4"></div>
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
                  {
                    label: 'Ratio Confidence',
                    value: selectedRule.quantifiers.ratioconf.toFixed(3),
                  },
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
        </RuleDetail>
      </div>
    </div>
  );
}
