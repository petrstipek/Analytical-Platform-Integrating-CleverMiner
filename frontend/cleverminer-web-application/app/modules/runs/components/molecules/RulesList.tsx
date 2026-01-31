import { ArrowRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/organisms/table';

export type RuleListRow = {
  id: number;
  text: string;
  metrics?: {
    confidence?: number;
    base?: number;
  };
};

interface RulesListProps {
  rules: RuleListRow[];
  selectedRuleId: number | null;
  onSelectRule: (rule: RuleListRow) => void;
}

export default function RulesList({ rules, selectedRuleId, onSelectRule }: RulesListProps) {
  const formatRule = (text: string) => {
    const [logic] = text.split('|');
    const parts = logic.split('=>');

    if (parts.length !== 2) return <span className="font-mono text-xs">{text}</span>;

    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-slate-700">{parts[0].trim()}</span>
        <ArrowRight className="h-4 w-4 text-slate-400" />
        <span className="font-medium text-indigo-700">{parts[1].trim()}</span>
      </div>
    );
  };

  const showConfidence = rules.some((r) => r.metrics?.confidence != null);
  const showBase = rules.some((r) => r.metrics?.base != null);

  return (
    <div className="overflow-hidden rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>Rule Logic</TableHead>
            {showConfidence && <TableHead className="text-right">Confidence</TableHead>}
            {showBase && <TableHead className="text-right">Base</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
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
              <TableCell className="text-sm">{formatRule(rule.text)}</TableCell>

              {showConfidence && (
                <TableCell className="text-right font-mono text-xs">
                  {rule.metrics?.confidence != null
                    ? `${(rule.metrics.confidence * 100).toFixed(1)}%`
                    : '—'}
                </TableCell>
              )}

              {showBase && (
                <TableCell className="text-right font-mono text-xs">
                  {rule.metrics?.base != null ? rule.metrics.base.toLocaleString() : '—'}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
