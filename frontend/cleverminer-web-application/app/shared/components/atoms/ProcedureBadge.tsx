import { Badge } from '@/shared/components/ui/atoms/badge';
import { ProceduresType } from '@/shared/domain/procedures.type';
import { cn } from '@/lib/utils';
import { PROCEDURE_STYLES } from '@/shared/components/styles/procedures-styling';

interface ProcedureBadgeProps {
  procedure: ProceduresType;
  className?: string;
}

export function ProcedureBadge({ procedure, className }: ProcedureBadgeProps) {
  const styles = PROCEDURE_STYLES[procedure];

  return (
    <Badge
      variant="secondary"
      className={cn('font-mono text-[10px] uppercase', styles.bg, styles.text, className)}
    >
      {procedure}
    </Badge>
  );
}
