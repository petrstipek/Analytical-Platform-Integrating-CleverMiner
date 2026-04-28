import type { ClmAnalysisResponse } from '@/modules/datasets/api/types/clmGuidance.type';

type DatasetClmGuidanceViewProps = {
  clmGuidance: ClmAnalysisResponse;
};

export function useCleverMinerGuidance({ clmGuidance: analysis }: DatasetClmGuidanceViewProps) {
  if (!analysis) return { goodCols: [], warningCols: [], ignoredCols: [] };

  const allCols = [
    ...analysis.target_candidates,
    ...analysis.cond_candidates.filter(
      (c) => !analysis.target_candidates.some((t) => t.name === c.name),
    ),
  ];

  const goodCols = allCols.filter((c) => c.clm?.clm_usable_as_is);
  const warningCols = allCols.filter((c) => c.clm && !c.clm.clm_usable_as_is);
  const ignoredCols = analysis.ignored_candidates;

  return { goodCols, warningCols, ignoredCols };
}
