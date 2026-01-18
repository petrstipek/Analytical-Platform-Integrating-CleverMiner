import { Box, Layers, Hash, ArrowRightLeft } from 'lucide-react';
import { Badge } from '@/shared/components/ui/atoms/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import { Separator } from '@/shared/components/ui/atoms/separator';

interface Attribute {
  name: string;
  attr_type: string;
  minlen?: number;
  maxlen?: number;
  gace?: string;
}

interface CedentData {
  type: 'con' | 'dis';
  minlen: number;
  maxlen: number;
  attributes: Attribute[];
}

interface CedentDetailProps {
  title: string;
  data: CedentData | null;
  color?: 'default' | 'blue' | 'green' | 'amber';
}

export default function CedentDetail({ title, data, color = 'default' }: CedentDetailProps) {
  if (!data || data.attributes.length === 0) return null;

  const bgColors = {
    default: 'bg-slate-50 border-slate-200',
    blue: 'bg-blue-50/50 border-blue-200',
    green: 'bg-green-50/50 border-green-200',
    amber: 'bg-amber-50/50 border-amber-200',
  };

  return (
    <Card className={`${bgColors[color]} border shadow-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="text-muted-foreground h-4 w-4" />
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
          </div>
          <Badge
            variant={data.type === 'con' ? 'default' : 'secondary'}
            className="text-[10px] uppercase"
          >
            {data.type === 'con' ? 'AND' : 'OR'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-muted-foreground flex items-center gap-4 text-xs">
          <div
            className="flex items-center gap-1"
            title="Cedent Length (How many attributes combined)"
          >
            <Hash className="h-3 w-3" />
            <span>
              Len: {data.minlen} - {data.maxlen}
            </span>
          </div>
        </div>

        <Separator className="bg-slate-200/60" />

        <div className="space-y-2">
          {data.attributes.map((attr, idx) => (
            <div
              key={idx}
              className="group hover:border-primary/50 flex items-center justify-between rounded-md border bg-white p-2 text-sm shadow-sm transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-500">
                  <Box className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">{attr.name}</div>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="h-5 px-1 font-mono text-[10px]">
                      {attr.attr_type}
                    </Badge>
                    {attr.gace && (
                      <span className="text-[10px] text-slate-400 uppercase">{attr.gace}</span>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="text-muted-foreground text-right text-xs"
                title="Attribute Length (Number of values)"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>
                    Val: {attr.minlen}-{attr.maxlen}
                  </span>
                  <ArrowRightLeft className="h-3 w-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
