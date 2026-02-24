import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/shared/components/ui/atoms/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type AttributeItem = {
  name: string;
  type: string;
};

type AttributesSelectorProps = {
  attributes: AttributeItem[];
  selected?: string;
  onSelect: (name: string) => void;
};

export default function AttributesSelector({
  attributes,
  selected,
  onSelect,
}: AttributesSelectorProps) {
  const [query, setQuery] = useState('');

  const filtered = attributes.filter(({ name }) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Card className="flex h-[700px] flex-col">
      <CardHeader className="shrink-0 pb-2">
        <CardTitle className="text-base">Attributes</CardTitle>
        <div className="relative">
          <SearchIcon className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search attribute…"
            className="pl-8 text-sm"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden pt-0">
        <div className="flex h-full flex-col gap-0.5 overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <p className="text-muted-foreground py-6 text-center text-xs">No attributes found</p>
          )}
          {filtered.map(({ name, type }) => (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                name === selected ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/70',
              )}
            >
              <span className="text-black' truncate">{name}</span>
              <span
                className={cn(
                  'ml-2 shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium',
                  name === selected
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground',
                  type === 'categorical' ? 'bg-green-200' : 'bg-orange-200',
                )}
              >
                {type}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
