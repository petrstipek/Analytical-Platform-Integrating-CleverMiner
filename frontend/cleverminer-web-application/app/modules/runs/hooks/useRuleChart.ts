import { useQuery } from '@tanstack/react-query';
import { getRuleChart } from '@/modules/runs/api/runs.api';

export function useRuleChart(runId: number, selectedRuleId: number | null) {
  const {
    data: chartUrl,
    isLoading: chartLoading,
    refetch: loadChart,
  } = useQuery({
    queryKey: ['rule-chart', runId, selectedRuleId],
    queryFn: () => getRuleChart(runId, selectedRuleId!),
    enabled: false,
    staleTime: Infinity,
  });

  return { chartUrl, chartLoading, loadChart };
}
