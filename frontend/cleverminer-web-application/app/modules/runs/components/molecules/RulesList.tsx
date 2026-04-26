import { ArrowRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/organisms/table';
import { ProceduresType } from '@/shared/domain/procedures.type';
import { renderCedent } from '@/modules/runs/utils/renderCedent';
import { getLabel } from '@/modules/runs/utils/getRuleLabel';

export type RuleListRow = {
  id: number;
  text: string;
  structure?: Record<string, { variable: string; categories: (string | number)[] }[]>;
  metrics?: {
    confidence?: number;
    base?: number;
    ratioconf?: number;
  };
};

interface RulesListProps {
  rules: RuleListRow[];
  selectedRuleId: number | null;
  onSelectRule: (rule: RuleListRow) => void;
  procedure: ProceduresType;
}

export default function RulesList({
  rules,
  selectedRuleId,
  onSelectRule,
  procedure,
}: RulesListProps) {
  const formatRule = (rule: RuleListRow) => {
    if (procedure === ProceduresType.CFMINER) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          {renderCedent(rule.structure?.cond ?? [], procedure)}
        </div>
      );
    }

    if (procedure === ProceduresType.SD4FTMINER) {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            {renderCedent(rule.structure?.ante ?? [], procedure)}
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
            {renderCedent(rule.structure?.succ ?? [], procedure)}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="font-semibold">:</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">
              {getLabel(rule.structure?.frst)}
            </span>
            <span className="font-semibold">×</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono">
              {getLabel(rule.structure?.scnd)}
            </span>
          </div>
        </div>
      );
    }

    if (procedure === ProceduresType.FOURFTMINER) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          {renderCedent(rule.structure?.ante ?? [], procedure)}
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
          {renderCedent(rule.structure?.succ ?? [], procedure)}
        </div>
      );
    }

    if (procedure === ProceduresType.UICMINER) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          {renderCedent(rule.structure?.ante ?? [], procedure)}
        </div>
      );
    }

    return <span className="font-mono text-xs text-amber-500">Unknown procedure: {procedure}</span>;
  };

  const showConfidence = rules.some((r) => r.metrics?.confidence != null);
  const showRatioconf = rules.some((r) => r.metrics?.ratioconf != null);
  const showBase = rules.some((r) => r.metrics?.base != null);

  return (
    <div className="h-full min-h-0 overflow-auto rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-slate-50">
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>Rule Logic</TableHead>
            {showConfidence && <TableHead className="text-right">Confidence</TableHead>}
            {showRatioconf && <TableHead className="text-right">Ratio Conf</TableHead>}
            {showBase && <TableHead className="pr-6 text-right">Base</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => {
            const pct = (rule.metrics?.confidence ?? 0) * 100;
            const confidenceColor =
              pct >= 60 ? 'text-green-600' : pct >= 30 ? 'text-amber-500' : 'text-red-500';

            return (
              <TableRow
                key={rule.id}
                className={`cursor-pointer transition-colors ${
                  selectedRuleId === rule.id
                    ? 'bg-indigo-50 hover:bg-indigo-100'
                    : 'hover:bg-slate-50'
                }`}
                onClick={() => onSelectRule(rule)}
              >
                <TableCell className="text-muted-foreground font-mono text-xs">{rule.id}</TableCell>
                <TableCell className="text-sm">{formatRule(rule)}</TableCell>
                {showConfidence && (
                  <TableCell className={`pr-6 text-right font-mono text-xs ${confidenceColor}`}>
                    {rule.metrics?.confidence != null
                      ? `${(rule.metrics.confidence * 100).toFixed(1)}%`
                      : '—'}
                  </TableCell>
                )}
                {showRatioconf && (
                  <TableCell className="text-right font-mono text-xs text-amber-600">
                    {rule.metrics?.ratioconf != null ? rule.metrics.ratioconf.toFixed(3) : '—'}
                  </TableCell>
                )}
                {showBase && (
                  <TableCell className="pr-6 text-right font-mono text-xs">
                    {rule.metrics?.base != null ? rule.metrics.base.toLocaleString() : '—'}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
