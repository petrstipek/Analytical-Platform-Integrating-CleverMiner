import React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronRight } from 'lucide-react';

type NavBarWizardProps = {
  steps: { id: number; label: string; icon: React.ComponentType<{ className?: string }> }[];
  validateAndMove: (targetStep: number) => void;
  step: number;
};

export default function NavBarWizard({ steps: STEPS, validateAndMove, step }: NavBarWizardProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center gap-2 rounded-md bg-white p-2 shadow-sm ring-1 ring-gray-200">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isCompleted = step > s.id;
          const isCurrent = step === s.id;

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
                    : isCompleted
                      ? 'text-primary hover:bg-primary/10'
                      : 'text-muted-foreground hover:bg-gray-100',
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
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
