import type { ProceduresType } from '@/shared/domain/procedures.type';
import { PROCEDURE_STYLES } from '@/shared/components/styles/procedures-styling';

export const renderCedent = (
  cedent: { variable: string; categories: (string | number)[] }[],
  procedure: ProceduresType,
) => {
  const { bg_light, text: textColour } = PROCEDURE_STYLES[procedure];
  return cedent.map((c, i) => (
    <div key={i} className="flex flex-wrap items-center gap-1">
      {i > 0 && <span className="text-xs font-semibold text-slate-400">&amp;</span>}
      <span className="text-xs font-semibold tracking-wide text-indigo-500 uppercase">
        {c.variable.replace(/_/g, ' ')}
      </span>
      <span className={`rounded px-1.5 py-0.5 font-mono text-xs ${bg_light} ${textColour}`}>
        {c.categories.join(', ')}
      </span>
    </div>
  ));
};
