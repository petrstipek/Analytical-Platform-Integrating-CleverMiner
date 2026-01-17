import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/molecules/card';
import { Badge } from '@/shared/components/ui/atoms/badge';

export default function SD4ftMinerDetails({ params }: { params: any }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Logic Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">Antecedent (Ante)</h4>
            <div className="flex flex-wrap gap-2">
              {params.ante.attributes.length > 0 ? (
                params.ante.attributes.map((attr: any, i: number) => (
                  <Badge key={i} variant="outline">
                    {attr.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-400">Empty</span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">Succedent (Succ)</h4>
            <div className="flex flex-wrap gap-2">
              {params.succ.attributes.map((attr: any, i: number) => (
                <Badge key={i} variant="secondary">
                  {attr.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quantifiers</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(params.quantifiers).map(
              ([key, val]) =>
                val !== null && (
                  <div key={key}>
                    <dt className="text-muted-foreground capitalize">{key}</dt>
                    <dd className="font-medium">{String(val)}</dd>
                  </div>
                ),
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
