import * as React from 'react';
import { cn } from '@/lib/utils';
import { TabsList, TabsTrigger } from '@/shared/components/ui/molecules/tabs';

export type TabsNavItem = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

type TabsNavProps = {
  items: TabsNavItem[];
  className?: string;
  triggerClassName?: string;
};

export function TabsNavForPages({ items, className, triggerClassName }: TabsNavProps) {
  return (
    <TabsList className="bg-muted w-full rounded-full p-1">
      {items.map((t) => (
        <TabsTrigger
          key={t.value}
          value={t.value}
          disabled={t.disabled}
          className={cn('flex-1', triggerClassName)}
        >
          {t.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
