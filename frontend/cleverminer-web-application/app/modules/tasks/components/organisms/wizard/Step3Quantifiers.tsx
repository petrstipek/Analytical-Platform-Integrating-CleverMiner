import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { QUANTIFIER_SCHEMAS } from '@/modules/tasks/domain/quantifier-definitions';
import type { QuantifierFieldDef } from '@/modules/tasks/domain/quantifier-definitions';
import { VectorInput } from '@/modules/tasks/components/molecules/';
import InfoTooltip from '@/modules/tasks/components/atoms/InfoTooltip';
import type { CreateTaskFormValues } from '@/modules/tasks/utils/task-validation';

interface Step3QuantifiersProps {
  procedure: string;
}

export default function Step3Quantifiers({ procedure }: Step3QuantifiersProps) {
  const { register, control } = useFormContext<CreateTaskFormValues>();
  const schema = QUANTIFIER_SCHEMAS[procedure] || [];

  const groups = schema.reduce(
    (acc, field) => {
      if (!acc[field.group]) acc[field.group] = [];
      acc[field.group].push(field);
      return acc;
    },
    {} as Record<string, QuantifierFieldDef[]>,
  );

  if (schema.length === 0) {
    return (
      <div className="text-muted-foreground p-4">
        No quantifier configuration found for {procedure}.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Analysis Quantifiers Setup
        </h2>
        <p className="text-muted-foreground">Define quantifiers for the selected analysis.</p>
      </div>
      {Object.entries(groups).map(([groupName, fields]) => (
        <Card key={groupName}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">{groupName}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {fields.map((field) => {
              if (field.type === 'vector') {
                return (
                  <Controller
                    key={field.key}
                    control={control}
                    name={`configuration.quantifiers.${field.key}`}
                    render={({ field: { value, onChange } }) => (
                      <VectorInput
                        label={field.label}
                        desc={field.desc}
                        value={(value as number[]) || null}
                        onChange={onChange}
                      />
                    )}
                  />
                );
              }

              return (
                <div key={field.key} className="space-y-1.5">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    {field.label}
                    {field.desc && <InfoTooltip text={field.desc} />}
                  </Label>
                  <Input
                    type="number"
                    step={field.type === 'float' ? '0.01' : '1'}
                    placeholder="Not set"
                    {...register(`configuration.quantifiers.${field.key}`, {
                      setValueAs: (v) => {
                        if (v === '' || v === undefined) return null;
                        const num = parseFloat(v);
                        return isNaN(num) ? null : num;
                      },
                    })}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
