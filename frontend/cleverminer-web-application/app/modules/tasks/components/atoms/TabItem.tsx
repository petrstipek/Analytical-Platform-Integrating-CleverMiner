import { TabsTrigger } from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export default function TabItem({
  value,
  label,
  count,
}: {
  value: string;
  label: string;
  count: number;
}) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        'rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium',
        'data-[state=active]:border-primary data-[state=active]:bg-cleverminer-two data-[state=active]:rounded-md data-[state=active]:text-white',
        'flex items-center gap-2',
      )}
    >
      <span className="truncate">{label}</span>
      {count > 0 && (
        <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs data-[state=active]:bg-white/20 data-[state=active]:text-white">
          {count}
        </span>
      )}
    </TabsTrigger>
  );
}
