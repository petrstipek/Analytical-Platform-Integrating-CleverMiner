import { Spinner } from '@/shared/components/ui/molecules/spinner';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/molecules/empty';

type LoadingStatusProps = {
  title?: string;
  description?: string;
  hint?: string;
};

export default function LoadingStatus({
  title = 'Processing your request',
  description = 'Please wait while we process your request.',
  hint = 'Do not refresh the page.',
}: LoadingStatusProps = {}) {
  return (
    <Empty className="animate-pulse-subtle w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="mb-2">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
        {hint && <p className="text-muted-foreground/50 mt-1 text-xs">{hint}</p>}
      </EmptyHeader>
    </Empty>
  );
}
