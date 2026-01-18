import { Target } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/molecules/card';
import { CedentDetail, QuantifiersDetail } from '@/modules/tasks/components/molecules';

export default function CFMinerDetails({ params }: { params: any }) {
  return (
    <div className="space-y-6">
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

      <QuantifiersDetail data={params.quantifiers} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase">Context (Condition)</h3>
          <CedentDetail title="Condition" data={params.cond} color="amber" />
        </div>

        {params.ante?.attributes?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase">Filters</h3>
            <CedentDetail title="Regular Attributes" data={params.ante} />
          </div>
        )}
      </div>
    </div>
  );
}
