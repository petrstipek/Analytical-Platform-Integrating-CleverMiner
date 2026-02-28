import { cn } from '@/lib/utils';

type PlatformTitlesProps = {
  className?: string;
  title: string;
  description?: string;
};

export default function PlatformTitles({ title, className, description }: PlatformTitlesProps) {
  return (
    <div
      className={cn(
        'bg-background/80 mb-4 flex flex-row items-center justify-between rounded-xl border p-4 shadow-xl ring-1 ring-black/5',
        className,
      )}
    >
      <div className={'text-2xl font-semibold'}>{title}</div>
      <div className={'text-gray-400'}>{description}</div>
    </div>
  );
}
