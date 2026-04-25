import type { DatasetStats } from '@/modules/datasets/api/types/clmGuidance.type';
import { useMemo } from 'react';

export function useDatasetPreprocessing(columnsAnalysis: DatasetStats) {
  if (!columnsAnalysis) return { stats: { total: 0, good: 0, warning: 0, bad: 0 } };

  const processedColumns = useMemo(() => {
    if (!columnsAnalysis?.columns) return [];

    return columnsAnalysis.columns.map((col: any) => {
      let status: 'good' | 'warning' | 'bad' = 'warning';

      if (col.clm_guidance?.recommended_representation === 'ignore') {
        status = 'bad';
      } else if (col.clm_guidance?.clm_usable_as_is) {
        status = 'good';
      }

      const mappedCol = {
        ...col,
        clm: col.clm_guidance,
        reason: col.clm_guidance?.reasons?.[0],
      };

      return { data: mappedCol, status };
    });
  }, [columnsAnalysis]);

  const stats = useMemo(() => {
    return {
      total: processedColumns.length,
      good: processedColumns.filter((c) => c.status === 'good').length,
      warning: processedColumns.filter((c) => c.status === 'warning').length,
      bad: processedColumns.filter((c) => c.status === 'bad').length,
    };
  }, [processedColumns]);

  return {
    stats,
  };
}
