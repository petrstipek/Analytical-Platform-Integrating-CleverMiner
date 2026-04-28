import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/shared/components/ui/atoms/input';
import { Label } from '@/shared/components/ui/atoms/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import { QUANTIFIER_SCHEMAS } from '@/modules/tasks/domain/quantifier-definitions';
import type { QuantifierFieldDef } from '@/modules/tasks/domain/quantifier-definitions';
import { VectorInput } from '@/modules/tasks/components/molecules/';
import InfoTooltip from '@/modules/tasks/components/atoms/InfoTooltip';
import type { CreateTaskFormValues } from '@/modules/tasks/utils/task-validation';
import { ProceduresType } from '@/shared/domain/procedures.type';

interface Step3QuantifiersProps {
  procedure: string;
  targetCategories?: string[];
}

export default function Step3Quantifiers({ procedure, targetCategories }: Step3QuantifiersProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateTaskFormValues>();
  const schema = QUANTIFIER_SCHEMAS[procedure] || [];
  const quantifierErrors = errors.configuration?.quantifiers;

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
              const fieldError = quantifierErrors?.[
                field.key as keyof typeof quantifierErrors
              ] as any;

              if (field.type === 'vector') {
                return (
                  <Controller
                    key={field.key}
                    control={control}
                    name={`configuration.quantifiers.${field.key}`}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                      <div className="space-y-1.5">
                        <VectorInput
                          label={field.label}
                          desc={field.desc}
                          value={(value as number[]) || null}
                          onChange={onChange}
                          categories={field.key === 'aad_weights' ? targetCategories : undefined}
                        />
                        {error && <p className="text-destructive text-sm">{error.message}</p>}
                      </div>
                    )}
                  />
                );
              }

              return (
                <div key={field.key} className="space-y-1.5">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                    {field.desc && <InfoTooltip text={field.desc} />}
                  </Label>
                  <Input
                    type="number"
                    step={field.type === 'float' ? '0.01' : '1'}
                    min={field.min}
                    max={field.max}
                    placeholder={field.required ? 'Required' : 'Not set'}
                    {...register(`configuration.quantifiers.${field.key}`, {
                      setValueAs: (v) => {
                        if (v === '' || v === undefined) return null;
                        const num = parseFloat(v);
                        return isNaN(num) ? null : num;
                      },
                    })}
                  />
                  {(field.min !== undefined || field.max !== undefined) && (
                    <p className="text-muted-foreground text-[11px]">
                      {field.min !== undefined && field.max !== undefined
                        ? `Between ${field.min} and ${field.max}`
                        : field.min !== undefined
                          ? `Min: ${field.min}`
                          : `Max: ${field.max}`}
                    </p>
                  )}
                  {fieldError?.message && (
                    <p className="text-destructive text-sm">{fieldError.message}</p>
                  )}
                </div>
              );
            })}
            {groupName === 'Histogram Steps' && procedure === ProceduresType.CFMINER && (
              <p className="text-muted-foreground col-span-2 text-[11px]">
                * At least one step quantifier is required.
              </p>
            )}

            {groupName === 'Histogram Steps' &&
              procedure === ProceduresType.CFMINER &&
              (quantifierErrors?.S_Down as any)?.message && (
                <p className="text-destructive col-span-2 text-sm">
                  {(quantifierErrors?.S_Down as any)?.message}
                </p>
              )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
