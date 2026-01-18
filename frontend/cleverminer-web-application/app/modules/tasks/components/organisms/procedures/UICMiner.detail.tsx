import { Scale } from 'lucide-react';
import { CedentDetail, QuantifiersDetail } from '@/modules/tasks/components/molecules';

export default function UICMinerDetails({ params }: { params: any }) {
  return (
    <div className="space-y-6">
      <QuantifiersDetail data={params.quantifiers} />

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
        {params.cond?.attributes?.length > 0 && (
          <div className="md:col-span-2">
            <h3 className="mb-2 text-sm font-semibold tracking-wider text-slate-500 uppercase">
              Context (Condition)
            </h3>
            <CedentDetail title="Condition" data={params.cond} color="amber" />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <div className="rounded bg-indigo-100 p-1 text-indigo-600">1</div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-700 uppercase">
              First Set
            </h3>
          </div>
          <CedentDetail title="Set 1 Definition" data={params.set1} color="blue" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <div className="rounded bg-rose-100 p-1 text-rose-600">2</div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-700 uppercase">
              Second Set
            </h3>
          </div>
          <CedentDetail title="Set 2 Definition" data={params.set2} color="green" />
        </div>

        <div className="absolute top-1/2 left-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md md:flex">
          <Scale className="h-5 w-5 text-slate-400" />
        </div>
      </div>
    </div>
  );
}
