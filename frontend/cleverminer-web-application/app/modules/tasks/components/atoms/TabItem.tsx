import { TabsTrigger } from '@radix-ui/react-tabs';

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
      className="data-[state=active]:bg-secondary w-full justify-between px-4 py-2 text-left"
    >
      <span className="truncate">{label}</span>
      {count > 0 && (
        <span className="bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs">
          {count}
        </span>
      )}
    </TabsTrigger>
  );
}
