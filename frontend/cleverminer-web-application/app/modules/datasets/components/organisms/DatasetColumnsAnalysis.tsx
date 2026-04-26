import { useState } from 'react';
import type {
  DatasetColumnStats,
  DatasetStats,
} from '@/modules/datasets/api/types/clmGuidance.type';
import {
  PreparedTransformations,
  TransformationDialog,
} from '@/modules/datasets/components/molecules';
import ColumnDetailsDrawer from '@/modules/datasets/components/molecules/ColumnDetailsDrawer';
import { BaseStatCard } from '@/shared/components/atoms';
import { PlatformCard } from '@/shared/components/molecules';
import { Dialog } from '@/shared/components/ui/molecules/dialog';
import { useDatasetPreprocessing } from '@/modules/datasets/hooks/datasetPreprocessing.hook';
import { useDatasetColumnsAnalysis } from '@/modules/datasets/hooks/datasetColumnsAnalysis.hook';
import { PreprocessingColumnsList } from '@/modules/datasets/components/organisms/index';

type DatasetColumnsAnalysisView = {
  columnsAnalysis: DatasetStats;
  datasetId: string;
};
export default function DatasetColumnsAnalysisView({
  columnsAnalysis,
  datasetId,
}: DatasetColumnsAnalysisView) {
  const [selectedColumn, setSelectedColumn] = useState<DatasetColumnStats | null>(null);
  const { columnVisibilityAction } = useDatasetPreprocessing(Number(datasetId));
  const {
    searchTerm,
    setSearchTerm,
    derivedName,
    setDerivedName,
    dialogOpen,
    setDialogOpen,
    steps,
    upsertStep,
    removeStepAtGlobalIndex,
    clearAll,
    filteredColumns,
    stats,
    hasColumn,
    isPending,
    isSuccess,
    handleTransformation,
    statusFilter,
    setStatusFilter,
  } = useDatasetColumnsAnalysis(columnsAnalysis, datasetId);

  const stagedStepsForColumn = steps
    .map((step, index) => ({ step, index }))
    .filter(({ step }) => hasColumn(step) && step.column === selectedColumn?.name);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="flex flex-col gap-4">
        <PlatformCard
          cardTitle={'Columns Base Stats'}
          cardDescription={'Explore summary statistics.'}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <BaseStatCard
              title="Total columns"
              value={stats.total}
              className={'border-l-blue-300 bg-blue-50'}
            />
            <BaseStatCard
              title="Ready to use"
              value={stats.good}
              className={'border-l-green-500 bg-green-50'}
            />
            <BaseStatCard
              title="Needs review"
              value={stats.warning}
              className={'border-l-orange-500 bg-orange-50'}
            />
            <BaseStatCard
              title="Ignored"
              value={stats.bad}
              className={'border-l-gray-500 bg-gray-50'}
            />
          </div>
        </PlatformCard>

        {steps.length > 0 && (
          <PlatformCard
            cardTitle={'Applied Preprocess steps'}
            cardDescription={'Preview preprocessed steps.'}
          >
            <PreparedTransformations
              steps={steps}
              removeStepAtGlobalIndex={removeStepAtGlobalIndex}
              clearAll={clearAll}
              isPending={isPending}
              isSuccess={isSuccess}
            />
          </PlatformCard>
        )}

        <PreprocessingColumnsList
          filteredColumns={filteredColumns}
          steps={steps}
          stats={stats}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onColumnClick={setSelectedColumn}
          onVisibilityChange={(column, visible) =>
            columnVisibilityAction.mutation({ column, visible })
          }
        />

        <ColumnDetailsDrawer
          key={selectedColumn?.name ?? 'none'}
          open={!!selectedColumn}
          column={selectedColumn}
          onOpenChange={(isOpen) => !isOpen && setSelectedColumn(null)}
          stagedSteps={stagedStepsForColumn.map((s) => s.step)}
          onAddStep={upsertStep}
          onRemoveStep={(localIndex) => {
            const globalIndex = stagedStepsForColumn[localIndex].index;
            removeStepAtGlobalIndex(globalIndex);
          }}
        />
      </div>
      <TransformationDialog
        handleTransformation={handleTransformation}
        isPending={isPending}
        clearAll={clearAll}
        derivedName={derivedName}
        setDerivedName={setDerivedName}
        onClose={() => setDialogOpen(false)}
      />
    </Dialog>
  );
}
