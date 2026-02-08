import { CedentDetail, QuantifiersDetail } from '@/modules/tasks/components/molecules';

export default function SD4ftMinerDetails({ params }: { params: any }) {
  return (
    <div className="space-y-6">
      <QuantifiersDetail data={params.quantifiers} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
              Left Side (If)
            </h3>
          </div>
          <CedentDetail title="Antecedent" data={params.ante} color="blue" />
          <CedentDetail title="Condition" data={params.cond} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
              Right Side (Then)
            </h3>
          </div>
          <CedentDetail title="Succedent" data={params.succ} color="green" />
        </div>
      </div>

      {(params.set1?.attributes?.length > 0 || params.set2?.attributes?.length > 0) && (
        <div className="grid grid-cols-1 gap-6 border-t pt-6 md:grid-cols-2">
          <CedentDetail title="Set 1" data={params.set1} />
          <CedentDetail title="Set 2" data={params.set2} />
        </div>
      )}
    </div>
  );
}
