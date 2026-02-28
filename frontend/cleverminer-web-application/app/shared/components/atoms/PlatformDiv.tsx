import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function PlatformDiv({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-background/80 rounded-2xl border py-4 shadow-xl ring-1 ring-black/5',
        className,
      )}
    >
      {children}
    </div>
  );
}
