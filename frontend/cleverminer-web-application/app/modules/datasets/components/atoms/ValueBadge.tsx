import type { ReactNode } from 'react';
import { Badge } from '@/shared/components/ui/atoms/badge';

export default function ValueBadge({ children }: { children: ReactNode }) {
  return (
    <Badge variant="outline" className="text-[10px] font-normal">
      {children}
    </Badge>
  );
}
