import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import React from 'react';

interface BaseSummaryCardProps {
  title: string;
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'running';
  icon?: React.ReactNode;
}

export default function BaseSummaryCard({
  title,
  value,
  variant = 'default',
  icon,
}: BaseSummaryCardProps) {
  const styles = {
    default: {
      card: 'border-l-4 border-l-blue-800',
      text: 'text-foreground',
    },
    success: {
      card: 'border-l-4 border-l-green-500',
      text: 'text-green-600',
    },
    warning: {
      card: 'border-l-4 border-l-amber-500',
      text: 'text-amber-600',
    },
    running: {
      card: 'border-l-4 border-l-blue-500',
      text: 'text-blue-600',
    },
  };

  const activeStyle = styles[variant];

  return (
    <Card className={cn('shadow-sm', activeStyle.card)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className={cn('text-2xl font-bold', activeStyle.text)}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
      </CardHeader>
    </Card>
  );
}
