import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import type { AttributeProfile } from '@/modules/datasets/domain/dataset-profile.type';
import {
  BarChartHorizontal,
  NumericHistogramBarChart,
  NumericBoxplotSummary,
} from '@/modules/datasets/components/molecules/charts/index';
import { StatComponent } from '@/shared/components/atoms';

export default function AttributeDetails({
  name,
  profile,
}: {
  name: string;
  profile?: AttributeProfile;
}) {
  if (!profile) {
    return (
      <Card>
        <CardContent className="text-muted-foreground p-6 text-sm">
          Select an attribute.
        </CardContent>
      </Card>
    );
  }

  if (profile.type === 'categorical') {
    return (
      <div className="space-y-4">
        <BarChartHorizontal
          title={`Top values: ${name}`}
          description="Most frequent categories"
          topValues={profile.top_values}
        />
      </div>
    );
  }

  if (profile.type === 'numeric') {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{name}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <StatComponent label="Min" value={profile.stats?.min ?? '—'} />
            <StatComponent label="Max" value={profile.stats?.max ?? '—'} />
            <StatComponent label="Missing" value={profile.stats?.missing ?? '—'} />
            <StatComponent label="Mean" value={profile.stats?.mean ?? '—'} />
            <StatComponent label="Median" value={profile.stats?.median ?? '—'} />
            <StatComponent label="Std" value={profile.stats?.std ?? '—'} />
          </CardContent>
        </Card>

        {profile.histogram && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Histogram</CardTitle>
            </CardHeader>
            <CardContent>
              <NumericHistogramBarChart attributeName={name} histogram={profile.histogram} />
            </CardContent>
          </Card>
        )}

        {profile.boxplot && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Outliers / Boxplot</CardTitle>
            </CardHeader>
            <CardContent>
              <NumericBoxplotSummary box={profile.boxplot} />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
}
