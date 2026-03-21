import type { ReactNode } from 'react';
import { Badge } from '@/shared/components/ui/atoms/badge';

export default function DerivedDatasetStepCard({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border p-3">
      <div className="gap-2">
        <Badge variant="secondary" className="text-[10px] uppercase">
          Step {index + 1}
        </Badge>
        <span className="ml-2 text-sm font-medium">{title}</span>
        <div className="mt-2 space-y-1 text-sm">{children}</div>
      </div>
    </div>
  );
}
