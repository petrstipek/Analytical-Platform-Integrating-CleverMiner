import { BaseStatCard } from '@/shared/components/atoms';
import type { DatasetProfileResult } from '@/modules/datasets/domain/dataset-profile.type';
import { PlatformCard } from '@/shared/components/molecules';

export default function DatasetEDAOverviewStats({
  overview,
}: {
  overview: DatasetProfileResult['overview'];
}) {
  return (
    <PlatformCard
      cardTitle={'Base Data Overview'}
      cardDescription={'Explore base statistical data.'}
    >
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <BaseStatCard title="Rows" value={overview.rows} className={'border-l-green-500'} />
        <BaseStatCard title="Columns" value={overview.columns} className={'border-l-green-500'} />
        <BaseStatCard
          title="Numeric"
          value={overview.numeric_columns}
          className={'border-l-violet-500'}
        />
        <BaseStatCard
          title="Categorical"
          value={overview.categorical_columns}
          className={'border-l-yellow-300'}
        />
        <BaseStatCard
          title="Missing cells"
          value={overview.missing_cells}
          className={'border-l-red-500'}
        />
        <BaseStatCard
          title="Duplicate rows"
          value={overview.duplicate_rows}
          className={'border-l-red-500'}
        />
      </div>
    </PlatformCard>
  );
}
