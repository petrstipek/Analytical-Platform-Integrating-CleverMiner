import { useFormContext, Controller } from 'react-hook-form';
import { Tabs, TabsList, TabsContent } from '@/shared/components/ui/molecules/tabs';
import { CedentEditor } from '../../molecules';
import { LOGIC_LAYOUTS, SECTION_LABELS } from '@/modules/tasks/utils/logic-layout';
import type { CreateTaskFormValues } from '@/modules/tasks/utils/task-validation';
import TabItem from '@/modules/tasks/components/atoms/TabItem';
import type { DatasetsColumnsType } from '@/modules/datasets/domain/datasetsColumns.type';
import { TargetEditor } from '@/modules/tasks/components/molecules';

interface Step2LogicBuilderProps {
  procedure: string;
  availableColumns: DatasetsColumnsType[];
  isLoading: boolean;
}

export default function Step2LogicBuilder({
  procedure,
  availableColumns,
  isLoading,
}: Step2LogicBuilderProps) {
  const { control, watch } = useFormContext<CreateTaskFormValues>();

  const visibleSections = LOGIC_LAYOUTS[procedure] || [];

  const config = watch('configuration');

  const header = (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">Analysis Cedents Setup</h2>
      <p className="text-muted-foreground">Choose cedents and other parameters for the analysis.</p>
    </div>
  );

  if (isLoading) {
    return <div>Loading columns...</div>;
  }

  const tabsDefaultValue = visibleSections.includes('target')
    ? visibleSections[1]
    : visibleSections[0];

  return (
    <div className={'space-y-6'}>
      {header}
      <div className="flex min-h-[500px] flex-col gap-6 md:flex-row">
        <Tabs defaultValue={tabsDefaultValue} orientation="vertical" className="flex w-full gap-6">
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
          {visibleSections.includes('target') && (
            <TargetEditor availableColumns={availableColumns} isLoading={isLoading} />
          )}
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
                        availableColumns={availableColumns}
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
