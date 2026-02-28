import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function BaseStatCard({
  title,
  value,
  className,
}: {
  title: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('border-l-cleverminer-one border-l-4', className)}>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-lg font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
