import { useFormContext, Controller } from 'react-hook-form';
import { CedentEditor } from '../../molecules';
import { LOGIC_LAYOUTS, SECTION_LABELS } from '@/modules/tasks/utils/logic-layout';
import type { CreateTaskFormValues } from '@/modules/tasks/utils/task-validation';
import type { DatasetsColumnsType } from '@/modules/datasets/domain/datasetsColumns.type';
import { TargetEditor } from '@/modules/tasks/components/molecules';
import { Fragment, useState } from 'react';
import { AlertCircle, AlertTriangle, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/atoms/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/molecules/alert-dialog';

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
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<CreateTaskFormValues>();
  const getHighCardinalityAttrs = (section: string) => {
    const attrs = (config?.[section as keyof typeof config] as any)?.attributes ?? [];
    return attrs
      .map((a: any) => availableColumns.find((col) => col.name === a.name))
      .filter((col: DatasetsColumnsType | undefined) => col && col.distinct > 100)
      .map((col: DatasetsColumnsType) => col.name);
  };

  const navigateTo = (index: number) => {
    const offenders = getHighCardinalityAttrs(activeSection);
    if (offenders.length > 0) {
      setPendingSection(index);
      setShowWarning(true);
    } else {
      setCurrentSection(index);
    }
  };

  const visibleSections = (LOGIC_LAYOUTS[procedure] || []).filter((s) => s !== 'target');
  const [currentSection, setCurrentSection] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingSection, setPendingSection] = useState<number | null>(null);

  const config = watch('configuration');
  const configErrors = errors.configuration;

  if (isLoading) return <div>Loading columns...</div>;

  const activeSection = visibleSections[currentSection];
  const isLast = currentSection === visibleSections.length - 1;
  const isFirst = currentSection === 0;

  const datasetId = watch('dataset');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Analysis Cedents Setup</h2>
        <p className="text-muted-foreground">
          Choose cedents and other parameters for the analysis.
        </p>
      </div>

      <nav className="flex items-center gap-2">
        {visibleSections.map((section, i) => {
          const count = (config?.[section as keyof typeof config] as any)?.attributes?.length || 0;
          const hasError = !!configErrors?.[section as keyof typeof configErrors];
          const isActive = i === currentSection;
          const isDone = i < currentSection;

          return (
            <Fragment key={section}>
              <button
                type="button"
                onClick={() => navigateTo(i)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : hasError
                      ? 'text-destructive hover:bg-destructive/10'
                      : isDone
                        ? 'text-primary hover:bg-primary/10'
                        : 'text-muted-foreground hover:bg-gray-100',
                )}
              >
                {hasError ? (
                  <AlertCircle className="h-4 w-4" />
                ) : isDone ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border text-xs">
                    {i + 1}
                  </span>
                )}
                <span className="hidden sm:inline">{SECTION_LABELS[section]}</span>
                {count > 0 && (
                  <span className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-xs">
                    {count}
                  </span>
                )}
              </button>
              {i < visibleSections.length - 1 && (
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
              )}
            </Fragment>
          );
        })}
      </nav>

      {(LOGIC_LAYOUTS[procedure] || []).includes('target') && (
        <TargetEditor availableColumns={availableColumns} isLoading={isLoading} />
      )}

      <div className="bg-background min-h-[400px] rounded-lg border p-6 shadow-sm">
        {visibleSections.map((section) => {
          const sectionError = configErrors?.[section as keyof typeof configErrors];

          return (
            <div key={section} className={section === activeSection ? 'block' : 'hidden'}>
              <Controller
                control={control}
                name={`configuration.${section}` as any}
                render={({ field }) => (
                  <>
                    <CedentEditor
                      title={SECTION_LABELS[section]}
                      description={`Configure the ${SECTION_LABELS[section]} logic.`}
                      config={field.value || { type: 'con', attributes: [], minlen: 1, maxlen: 1 }}
                      onChange={field.onChange}
                      availableColumns={availableColumns}
                      datasetId={datasetId}
                    />
                    {sectionError && (
                      <div className="mt-3 space-y-1">
                        {Object.entries(sectionError).map(([key, err]: [string, any]) =>
                          err?.message ? (
                            <p key={key} className="text-destructive text-sm">
                              {SECTION_LABELS[section]} — {err.message}
                            </p>
                          ) : null,
                        )}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between border-t-2 py-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentSection((i) => i - 1)}
          disabled={isFirst}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {!isFirst && (
            <span className="text-sm">{SECTION_LABELS[visibleSections[currentSection - 1]]}</span>
          )}
        </Button>

        <Button
          type="button"
          onClick={() => navigateTo(currentSection + 1)}
          disabled={isLast}
          className="flex items-center gap-2"
        >
          {!isLast && (
            <span className="text-sm">{SECTION_LABELS[visibleSections[currentSection + 1]]}</span>
          )}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Some attributes may be ignored
            </AlertDialogTitle>
            <AlertDialogDescription>
              The following attributes exceed 100 distinct values and will be skipped by the miner:{' '}
              <strong className="text-foreground">
                {getHighCardinalityAttrs(activeSection).join(', ')}
              </strong>
              . Consider applying a binning transformation first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowWarning(false)}>
              Go back and fix
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-amber-500 text-white hover:bg-amber-600"
              onClick={() => {
                setCurrentSection(pendingSection!);
                setShowWarning(false);
                setPendingSection(null);
              }}
            >
              Continue anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
