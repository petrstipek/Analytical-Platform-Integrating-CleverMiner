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
import { PROCEDURE_STYLES } from '@/shared/components/styles/procedures-styling';
import { renderCedent } from '@/modules/runs/utils/renderCedent';

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
  const getLabel = (
    cedent: { variable: string; categories: (string | number)[] }[] | undefined,
  ) => {
    if (!cedent) return '';
    return cedent.map((c) => `${c.variable}(${c.categories.join(', ')})`).join(' & ');
  };

  const formatRule = (rule: RuleListRow) => {
    const text = rule.text;
    const [logic] = text.split(' | ');
    const parts = logic.split('=>');

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

    if (parts.length !== 2) return <span className="font-mono text-xs">{text}</span>;

    const parseChunk = (chunk: string) => {
      const match = chunk.trim().match(/^(.+?)\((.+)\)$/);
      if (!match) return { field: chunk.trim(), values: [] as string[] };
      const field = match[1].replace(/_/g, ' ');
      const values = match[2].split(/\s+/).filter(Boolean);
      return { field, values };
    };

    const lhs = parseChunk(parts[0]);
    const rhs = parseChunk(parts[1]);

    const { bg_light, text: textColour } = PROCEDURE_STYLES[procedure];

    return (
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
            {lhs.field}
          </span>
          {lhs.values.map((v) => (
            <span
              key={v}
              className={`rounded px-1.5 py-0.5 font-mono text-xs ${bg_light} ${textColour}`}
            >
              {v}
            </span>
          ))}
        </div>

        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />

        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
            {rhs.field}
          </span>
          {rhs.values.map((v) => (
            <span
              key={v}
              className={`rounded px-1.5 py-0.5 font-mono text-xs ${bg_light} ${textColour}`}
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    );
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
            {showBase && <TableHead className="text-right">Base</TableHead>}
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
                  <TableCell className={`text-right font-mono text-xs ${confidenceColor}`}>
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
                  <TableCell className="text-right font-mono text-xs">
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
