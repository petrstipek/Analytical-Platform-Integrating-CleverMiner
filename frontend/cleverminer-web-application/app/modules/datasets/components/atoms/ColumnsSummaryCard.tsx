import { Card, CardContent } from '@/shared/components/ui/molecules/card';
import React from 'react';

type ColumnsSummaryCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  bg?: string;
};

export default function ColumnsSummaryCard({
  title,
  value,
  icon,
  color,
  bg,
}: ColumnsSummaryCardProps) {
  return (
    <Card className={`border-none shadow-sm ${bg}`}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            {title}
          </p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        {icon && <div className={`${color} opacity-80`}>{icon}</div>}
      </CardContent>
    </Card>
  );
}
