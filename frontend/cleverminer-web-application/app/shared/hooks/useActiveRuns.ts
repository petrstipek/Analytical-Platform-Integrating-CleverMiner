import { useQuery } from '@tanstack/react-query';
import { getActiveRuns } from '@/modules/runs/api/runs.api';
import type { ActiveRun } from '@/modules/runs/domain/active-runs.type';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { RunResultStatus } from '@/modules/runs/domain/runs-results.type';
import { useMe } from '@/modules/auth/api/queries/auth.queries';

function indexById(runs: ActiveRun[]): Map<number, ActiveRun> {
  return new Map(runs.map((r) => [r.id, r]));
}

export function useActiveRuns() {
  const { data: user } = useMe();

  const query = useQuery({
    queryKey: ['activeRuns'],
    queryFn: getActiveRuns,
    refetchInterval: 1000000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    enabled: !!user,
  });

  console.log('running');

  const prevRef = useRef<Map<number, ActiveRun> | null>(null);

  useEffect(() => {
    const runs = query.data?.runs;
    if (!runs) return;

    const current = indexById(runs);
    const prev = prevRef.current;

    if (!prev) {
      prevRef.current = current;
      return;
    }

    for (const [id, cur] of current) {
      const old = prev.get(id);
      if (!old) continue;

      if (old.status !== RunResultStatus.Running && cur.status === RunResultStatus.Running) {
        toast.info(`Run #${id} is now running.`);
      }
    }
    for (const [id, old] of prev) {
      if (!current.has(id)) {
        toast.info(`Run #${id} finished.`);
      }
    }

    prevRef.current = current;
  }, [query.data, toast]);

  return query;
}
