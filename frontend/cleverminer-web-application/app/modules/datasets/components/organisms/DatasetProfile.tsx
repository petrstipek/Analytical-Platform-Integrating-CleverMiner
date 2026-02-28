import { useMemo, useState } from 'react';
import type {
  DatasetProfileResult,
  AttributeProfile,
} from '@/modules/datasets/domain/dataset-profile.type';
import {
  AttributeDetails,
  AttributesSelector,
  DatasetEDAOverviewStats,
} from '@/modules/datasets/components/molecules';
import PlatformCollapsible from '@/shared/components/molecules/PlatformCollapsible';
import { PlatformCard } from '@/shared/components/molecules';
import { CorrelationHeatMap } from '@/modules/datasets/components/molecules/charts/index';

type Props = {
  datasetProfileData: DatasetProfileResult;
};

export default function DatasetProfile({ datasetProfileData }: Props) {
  const [query] = useState('');
  const entries = useMemo(
    () => Object.entries(datasetProfileData.attributes),
    [datasetProfileData.attributes],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(([name]) => name.toLowerCase().includes(q));
  }, [entries, query]);

  const [selected, setSelected] = useState<string>(() => filtered[0]?.[0] ?? '');
  const selectedProfile: AttributeProfile | undefined = datasetProfileData.attributes[selected];

  return (
    <div className="space-y-6">
      <DatasetEDAOverviewStats overview={datasetProfileData.overview} />

      <PlatformCollapsible
        collapsedTitle={'Correlation Analysis'}
        collapsedDescription={'Explore correlations between attributes.'}
        revealedTitle={'Correlation Matrix'}
      >
        <CorrelationHeatMap corr={datasetProfileData.correlation ?? undefined} />
      </PlatformCollapsible>

      <PlatformCard cardTitle={'Attributes Details'} cardDescription={'Explore attribute details.'}>
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <AttributesSelector
            selected={selected}
            attributes={entries.map(([name, profile]) => ({ name, type: profile.type }))}
            onSelect={setSelected}
          />
          <AttributeDetails name={selected} profile={selectedProfile} />
        </div>
      </PlatformCard>
    </div>
  );
}
