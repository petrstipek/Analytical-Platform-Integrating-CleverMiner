import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/molecules/card';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PlatformCardProps = {
  cardTitle: ReactNode;
  cardDescription?: string;
  children: ReactNode;
  className?: string;
};

export default function PlatformCard({
  cardTitle,
  cardDescription,
  children,
  className,
}: PlatformCardProps) {
  return (
    <Card
      className={cn('bg-background/80 rounded-2xl border shadow-xl ring-1 ring-black/5', className)}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
