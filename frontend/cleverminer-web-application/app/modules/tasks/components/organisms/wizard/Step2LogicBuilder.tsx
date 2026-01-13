import { useFormContext, Controller } from 'react-hook-form';
import { Target, Filter } from 'lucide-react';
import { Tabs, TabsList, TabsContent } from '@/shared/components/ui/tabs';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { CedentEditor } from '../../molecules';
import { LOGIC_LAYOUTS, SECTION_LABELS } from '@/modules/tasks/utils/logic-layout';
import type { CreateTaskFormValues } from '@/modules/tasks/utils/task-validation';
import TabItem from '@/modules/tasks/components/atoms/TabItem';

interface Step2LogicBuilderProps {
  procedure: string;
}

export default function Step2LogicBuilder({ procedure }: Step2LogicBuilderProps) {
  const { control, register, watch } = useFormContext<CreateTaskFormValues>();

  const visibleSections = LOGIC_LAYOUTS[procedure] || [];

  const config = watch('configuration');

  const header = (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Analysis Cedents Setup</h2>
      <p className="text-muted-foreground">Choose cedents and other parameters for the analysis.</p>
    </div>
  );

  if (procedure === 'CFMiner') {
    return (
      <div className="space-y-6">
        {header}
        {visibleSections.includes('target') && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Target className="text-primary h-5 w-5" /> Target Attribute
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Column Name</Label>
                <Input {...register('configuration.target')} placeholder="e.g. Severity" />
                <p className="text-muted-foreground text-sm">
                  The main attribute to analyze (histogram axis).
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {visibleSections.includes('cond') && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Filter className="text-primary h-5 w-5" /> Condition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                control={control}
                name="configuration.cond"
                render={({ field }) => (
                  <CedentEditor
                    title="Filter Condition"
                    description="Restrict the analysis to a specific subset of data."
                    config={
                      (field.value as any) || { type: 'con', attributes: [], minlen: 1, maxlen: 1 }
                    }
                    onChange={field.onChange}
                  />
                )}
              />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className={'space-y-6'}>
      {header}
      <div className="flex min-h-[500px] flex-col gap-6 md:flex-row">
        <Tabs
          defaultValue={visibleSections[0]}
          orientation="vertical"
          className="flex w-full gap-6"
        >
          <TabsList className="flex h-auto w-48 flex-col items-start justify-start space-y-1 bg-transparent p-0">
            {visibleSections.map((section) => {
              if (section === 'target') return null;

              const count =
                (config?.[section as keyof typeof config] as any)?.attributes?.length || 0;

              return (
                <TabItem
                  key={section}
                  value={section}
                  label={SECTION_LABELS[section]}
                  count={count}
                />
              );
            })}
          </TabsList>

          <div className="bg-background flex-1 rounded-lg border p-6 shadow-sm">
            {visibleSections.map((section) => {
              if (section === 'target') return null;

              return (
                <TabsContent key={section} value={section} className="m-0 mt-0">
                  <Controller
                    control={control}
                    name={`configuration.${section}` as any}
                    render={({ field }) => (
                      <CedentEditor
                        title={SECTION_LABELS[section]}
                        description={`Configure the ${SECTION_LABELS[section]} logic.`}
                        config={
                          field.value || { type: 'con', attributes: [], minlen: 1, maxlen: 1 }
                        }
                        onChange={field.onChange}
                      />
                    )}
                  />
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
