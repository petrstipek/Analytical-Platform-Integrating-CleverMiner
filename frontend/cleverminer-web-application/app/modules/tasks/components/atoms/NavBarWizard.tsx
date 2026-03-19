import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, Check, ChevronRight } from 'lucide-react';
import type { FieldErrors } from 'react-hook-form';
import type { CreateTaskFormValues } from '@/modules/tasks/utils/task-validation';

type NavBarWizardProps = {
  steps: { id: number; label: string; icon: React.ComponentType<{ className?: string }> }[];
  validateAndMove: (targetStep: number) => void;
  step: number;
  errors?: FieldErrors<CreateTaskFormValues>;
};

export default function NavBarWizard({
  steps: STEPS,
  validateAndMove,
  step,
  errors = {},
}: NavBarWizardProps) {
  const stepHasError = (stepId: number, errors: FieldErrors<CreateTaskFormValues>) => {
    if (stepId === 1) return !!(errors.name || errors.dataset || errors.procedure);
    if (stepId === 2) {
      const { quantifiers, ...rest } = errors.configuration ?? {};
      return Object.keys(rest).length > 0;
    }
    if (stepId === 3) return !!errors.configuration?.quantifiers;
    return false;
  };

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center gap-2 rounded-md bg-white">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isCompleted = step > s.id;
          const isCurrent = step === s.id;
          const hasError = isCompleted && stepHasError(s.id, errors);

          return (
            <li key={s.id} className="flex items-center">
              <button
                type="button"
                onClick={() => validateAndMove(s.id)}
                disabled={s.id > step + 1}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isCurrent
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : hasError
                      ? 'text-destructive hover:bg-destructive/10'
                      : isCompleted
                        ? 'text-primary hover:bg-primary/10'
                        : 'text-muted-foreground hover:bg-gray-100',
                )}
              >
                {hasError ? (
                  <AlertCircle className="h-4 w-4" />
                ) : isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </button>

              {i < STEPS.length - 1 && <ChevronRight className="mx-2 h-4 w-4 text-gray-300" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
