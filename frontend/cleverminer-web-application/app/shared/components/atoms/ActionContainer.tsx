import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function ActionContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-background/80 flex items-center gap-2 rounded-2xl border p-4 shadow-xl ring-1 ring-black/5',
        className,
      )}
    >
      {children}
    </div>
  );
}
