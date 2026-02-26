import { ActionContainer } from '@/shared/components/atoms';
import type { ReactNode } from 'react';

type ModulePagesHeaderProps = {
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
};

export default function ModulePagesHeader({
  title,
  description,
  children,
  className,
}: ModulePagesHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <ActionContainer className={'flex flex-1 flex-row gap-6'}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </ActionContainer>
      {children && <ActionContainer>{children}</ActionContainer>}
    </div>
  );
}
