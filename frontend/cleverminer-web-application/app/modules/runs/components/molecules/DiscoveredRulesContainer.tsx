import { RulesList } from '@/modules/runs/components/molecules/index';
import type { RuleListRow } from '@/modules/runs/components/molecules/RulesList';
import { ProceduresType } from '@/shared/domain/procedures.type';
import { PlatformCard } from '@/shared/components/molecules';

type DiscoveredRulesContainerProps = {
  rules: RuleListRow[];
  selectedId: number | null;
  setSelectedId: (id: number) => void;
  procedure: ProceduresType;
};

export default function DiscoveredRulesContainer({
  rules,
  selectedId,
  setSelectedId,
  procedure,
}: DiscoveredRulesContainerProps) {
  return (
    <div className="space-y-4 lg:col-span-2">
      <PlatformCard
        cardTitle={'Discovered Rules'}
        cardDescription={'Explore all discovered rules.'}
      >
        <RulesList
          rules={rules}
          selectedRuleId={selectedId}
          onSelectRule={(row) => setSelectedId(row.id)}
          procedure={procedure}
        />
      </PlatformCard>
    </div>
  );
}
