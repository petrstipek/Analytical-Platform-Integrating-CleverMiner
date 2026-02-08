import { Scale } from 'lucide-react';
import { CedentDetail, QuantifiersDetail } from '@/modules/tasks/components/molecules';

export default function UICMinerDetails({ params }: { params: any }) {
  console.log(params);
  return (
    <div className="space-y-6">
      <QuantifiersDetail data={params.quantifiers} />

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
        {params.ante?.attributes?.length > 0 && (
          <div className="md:col-span-2">
            <h3 className="mb-2 text-sm font-semibold tracking-wider text-slate-500 uppercase">
              Context
            </h3>
            <CedentDetail title="Antecedent" data={params.ante} color="amber" />
          </div>
        )}
      </div>
      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
        {params.cond?.attributes?.length > 0 && (
          <div className="md:col-span-2">
            <h3 className="mb-2 text-sm font-semibold tracking-wider text-slate-500 uppercase">
              Antecedent
            </h3>
            <CedentDetail title="Antecedent" data={params.cond} color="amber" />
          </div>
        )}
      </div>
    </div>
  );
}
