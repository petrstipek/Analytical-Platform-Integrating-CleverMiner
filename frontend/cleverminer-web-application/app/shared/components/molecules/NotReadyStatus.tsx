import { Spinner } from '@/shared/components/ui/molecules/spinner';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/molecules/empty';
import { Database } from 'lucide-react';

type LoadingStatusProps = {
  title?: string;
  description?: string;
  hint?: string;
};

export default function NotReadyStatus({
  title = 'Processing your request',
  description = 'The results will be available soon.',
  hint = 'Do not refresh the page.',
}: LoadingStatusProps = {}) {
  return (
    <Empty className="animate-pulse-subtle w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="mb-2">
          <Database className="text-muted-foreground/50 h-16 w-16 animate-pulse" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
        {hint && <p className="text-muted-foreground/50 mt-1 text-xs">{hint}</p>}
      </EmptyHeader>
    </Empty>
  );
}
