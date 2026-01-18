import { CedentDetail, QuantifiersDetail } from '@/modules/tasks/components/molecules';

export default function FourFtMinerDetails({ params }: { params: any }) {
  return (
    <div className="space-y-6">
      <QuantifiersDetail data={params.quantifiers} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="space-y-4 md:col-span-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
              Left Side (If)
            </h3>
          </div>
          <CedentDetail title="Antecedent" data={params.ante} color="blue" />
          <CedentDetail title="Condition" data={params.cond} color="amber" />
        </div>

        <div className="flex items-center justify-center py-4 md:col-span-1 md:py-0">
          <div className="rounded-full border bg-slate-100 p-2 shadow-sm" title="Implication">
            <span className="text-2xl font-bold text-slate-400">⇒</span>
          </div>
        </div>

        <div className="space-y-4 md:col-span-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
              Right Side (Then)
            </h3>
          </div>
          <CedentDetail title="Succedent" data={params.succ} color="green" />
        </div>
      </div>
    </div>
  );
}
