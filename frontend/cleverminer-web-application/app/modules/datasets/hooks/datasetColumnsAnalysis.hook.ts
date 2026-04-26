import { useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTransformations } from './datasetTransformation.hook';
import { createDerivedDataset } from '../api/dataset-analysis.api';
import type { DatasetStats } from '../api/types/clmGuidance.type';
import { TransformOptions, type TransformStep } from '../domain/datasetTransformations.type';

export function useDatasetColumnsAnalysis(columnsAnalysis: DatasetStats, datasetId: string) {
  const [searchTerm, setSearchTerm] = useState('');
  const [derivedName, setDerivedName] = useState(`Derived_${new Date().toISOString()}`);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'good' | 'warning' | 'bad' | null>(null);

  const { steps, upsertStep, removeStepAtGlobalIndex, clearAll } = useTransformations();

  const processedColumns = useMemo(() => {
    if (!columnsAnalysis?.columns) return [];
    return columnsAnalysis.columns.map((col: any) => {
      let status: 'good' | 'warning' | 'bad' = 'warning';
      if (col.clm_guidance?.recommended_representation === 'ignore') status = 'bad';
      else if (col.clm_guidance?.clm_usable_as_is) status = 'good';
      return {
        data: { ...col, clm: col.clm_guidance, reason: col.clm_guidance?.reasons?.[0] },
        status,
      };
    });
  }, [columnsAnalysis]);

  const filteredColumns = useMemo(
    () =>
      processedColumns.filter((item) => {
        const matchesSearch = item.data.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === null || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [processedColumns, searchTerm, statusFilter],
  );

  const stats = useMemo(
    () => ({
      total: processedColumns.length,
      good: processedColumns.filter((c) => c.status === 'good').length,
      warning: processedColumns.filter((c) => c.status === 'warning').length,
      bad: processedColumns.filter((c) => c.status === 'bad').length,
    }),
    [processedColumns],
  );

  function hasColumn(step: TransformStep): step is Extract<TransformStep, { column: string }> {
    return 'column' in step;
  }

  function affectedColumns(step: TransformStep): string[] {
    if ('column' in step) return [step.column];
    if (step.op === TransformOptions.dropColumns) return step.columns;
    return [];
  }

  const { mutate: applyTransformation, isPending } = useMutation({
    mutationFn: async (payload: { name: string; transform_spec: { steps: TransformStep[] } }) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return createDerivedDataset(datasetId, payload);
    },
    onError: (error: any) => toast.error(error.message),
    onSuccess: () => {
      toast.success('Transformation applied successfully! The dataset will be available soon.');
      clearAll();
    },
  });

  async function handleTransformation() {
    if (steps.length === 0) {
      return toast.error('No transformation steps staged. Please add some transformations first.');
    }
    setDialogOpen(false);
    applyTransformation({ name: derivedName, transform_spec: { steps } });
  }

  return {
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
    processedColumns,
    filteredColumns,
    stats,
    hasColumn,
    affectedColumns,
    isPending,
    handleTransformation,
    statusFilter,
    setStatusFilter,
  };
}
