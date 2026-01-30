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
};

export default function LoadingStatus({
  title = 'Processing your request',
  description = 'Please wait while we process your request. Do not refresh the page.',
}: LoadingStatusProps = {}) {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
