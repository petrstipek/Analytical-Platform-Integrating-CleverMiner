import { Target } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/molecules/card';
import {
  CedentDetail,
  QuantifiersDetail,
  TaskBaseOverview,
} from '@/modules/tasks/components/molecules';
import type { Task } from '@/modules/tasks/domain/task.type';

export default function CFMinerDetails({ params, task }: { params: any; task: Task }) {
  return (
    <div className="space-y-6">
      <TaskBaseOverview task={task} />
      <QuantifiersDetail data={params.quantifiers} />

      {params.target && (
        <Card className="border-indigo-200 bg-indigo-50">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium tracking-wide text-indigo-600/80 uppercase">
                Analysis Target
              </p>
              <h2 className="text-2xl font-bold text-indigo-950">{params.target}</h2>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase">Context</h3>
          <CedentDetail title="Condition" data={params.cond} color="amber" />
        </div>
      </div>
    </div>
  );
}
