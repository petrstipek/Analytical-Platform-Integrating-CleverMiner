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
  cardDescription?: ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
};

export default function PlatformCard({
  cardTitle,
  cardDescription,
  children,
  className,
  titleClassName,
  contentClassName,
}: PlatformCardProps) {
  return (
    <Card
      className={cn('bg-background/80 rounded-2xl border shadow-xl ring-1 ring-black/5', className)}
    >
      <CardHeader className={cn('flex flex-row items-center justify-between')}>
        <CardTitle className={cn('text-xl font-semibold', titleClassName)}>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
