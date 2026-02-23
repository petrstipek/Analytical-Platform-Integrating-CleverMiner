import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'border-border/40 relative flex items-end gap-1 border-b bg-transparent p-0 pb-0',
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'relative inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold whitespace-nowrap',
        'tracking-tight transition-all duration-200 ease-out',
        'rounded-none border-0 bg-transparent outline-none',
        'text-muted-foreground/60 hover:text-foreground',
        'after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[2px]',
        'after:bg-foreground after:scale-x-0 after:rounded-full',
        'after:transition-transform after:duration-200 after:ease-out',
        'data-[state=active]:text-foreground',
        'data-[state=active]:after:scale-x-100',
        'data-[state=active]:bg-foreground/5',
        'rounded-md',
        'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:opacity-30',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
