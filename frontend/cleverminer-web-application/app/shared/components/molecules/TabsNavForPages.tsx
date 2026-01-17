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
    <TabsList
      className={cn(
        'h-auto w-full justify-start rounded-none border-b bg-transparent p-0',
        className,
      )}
    >
      {items.map((t) => (
        <TabsTrigger
          key={t.value}
          value={t.value}
          disabled={t.disabled}
          className={cn(
            'data-[state=active]:border-primary rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:bg-transparent',
            triggerClassName,
          )}
        >
          {t.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
