import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/molecules/card';
import { Badge } from '@/shared/components/ui/atoms/badge';

export default function CFMinerDetails({ params }: { params: any }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>CF-Miner Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-muted-foreground mb-1 text-sm font-medium">Target Variable</h4>
            <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
              {params.target}
            </Badge>
          </div>

          <div>
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">Condition (Cond)</h4>
            <div className="flex flex-wrap gap-2">
              {params.cond?.attributes?.map((attr: any, i: number) => (
                <Badge key={i} variant="outline">
                  {attr.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(params.quantifiers).map(
              ([key, val]) =>
                val !== null && (
                  <div key={key} className="flex flex-col">
                    <dt className="text-muted-foreground text-xs tracking-wider uppercase">
                      {key.replace(/_/g, ' ')}
                    </dt>
                    <dd className="font-mono font-semibold">{String(val)}</dd>
                  </div>
                ),
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
