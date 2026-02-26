import { CedentDetail, QuantifiersDetail } from '@/modules/tasks/components/molecules';

export default function FourFtMinerDetails({ params }: { params: any }) {
  return (
    <div className="space-y-6">
      <QuantifiersDetail data={params.quantifiers} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
              Antecedent Attributes - Left Side (If)
            </h3>
          </div>
          <CedentDetail title="Antecedent" data={params.ante} color="blue" />
          <CedentDetail title="Condition" data={params.cond} color="amber" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
              Succedent Attributes - Right Side (Then)
            </h3>
          </div>
          <CedentDetail title="Succedent" data={params.succ} color="green" />
        </div>
      </div>
    </div>
  );
}
