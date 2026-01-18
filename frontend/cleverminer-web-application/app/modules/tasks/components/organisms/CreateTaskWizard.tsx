import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Settings, Calculator, BrainCircuit } from 'lucide-react';

import { Button } from '@/shared/components/ui/atoms/button';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/molecules/card';
import { Step1TaskSetup, Step2LogicBuilder, Step3Quantifiers } from './wizard/';
import { type CreateTaskFormValues, createTaskSchema } from '@/modules/tasks/utils/task-validation';
import {
  useCreateTaskAndRunMutation,
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from '@/modules/tasks/hooks/tasks.hook';
import { NavBarWizard } from '@/modules/tasks/components/atoms';
import type { DatasetType } from '@/modules/datasets/domain/dataset.type';
import { getDatasetsColumns } from '@/modules/tasks/api/tasks.api';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router';
import type { Task } from '@/modules/tasks/domain/task.type';
import { zodResolver } from '@hookform/resolvers/zod';

const STEPS = [
  { id: 1, label: 'Task Setup', icon: Settings },
  { id: 2, label: 'Logic Configuration', icon: BrainCircuit },
  { id: 3, label: 'Quantifiers', icon: Calculator },
];

type CreateTaskWizardProps = {
  datasets?: DatasetType[];
  datasetsLoading: boolean;
  existingTask?: Task;
};

export default function CreateTaskWizard({
  datasets,
  datasetsLoading,
  existingTask,
}: CreateTaskWizardProps) {
  const location = useLocation();
  const [step, setStep] = useState(1);
  type SubmitIntent = 'run' | 'save';
  const [intent, setIntent] = useState<SubmitIntent>('run');

  const taskId = existingTask?.id;

  const { mutate: updateTask, isPending: isUpdating } = useUpdateTaskMutation();
  const { mutate: createTaskAndRun, isPending } = useCreateTaskAndRunMutation();
  const { mutate: createTask, isPending: isCreating } = useCreateTaskMutation();

  const methods = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      dataset: 0,
      procedure: 'SD4ftMiner',
      configuration: {
        ante: { type: 'con', attributes: [], minlen: 1, maxlen: 5 },
        succ: { type: 'con', attributes: [], minlen: 1, maxlen: 5 },
        cond: null,
        set1: { type: 'con', attributes: [], minlen: 1, maxlen: 5 },
        set2: { type: 'con', attributes: [], minlen: 1, maxlen: 5 },
        quantifiers: {},
        opts: { no_optimizations: false },
      },
    },
  });

  useEffect(() => {
    if (existingTask) {
      const formData = {
        name: existingTask.name,
        dataset: existingTask.dataset,
        procedure: existingTask.procedure,
        configuration: existingTask.params,
      };
      methods.reset(formData);
      if (location.state?.initialStep) {
        setStep(location.state.initialStep);
      }
    }
  }, [existingTask, methods, location.state]);

  const selectedDatasetId = methods.watch('dataset');

  const { data: columns = [], isLoading: isLoadingColumns } = useQuery({
    queryKey: ['dataset-columns', selectedDatasetId],
    queryFn: () => getDatasetsColumns(Number(selectedDatasetId)),
    enabled: !!selectedDatasetId && Number(selectedDatasetId) !== 0,
  });

  const validateAndMove = async (targetStep: number) => {
    if (targetStep < step) {
      setStep(targetStep);
      return;
    }

    let isValid = false;
    if (step === 1) {
      isValid = await methods.trigger(['name', 'dataset', 'procedure']);
    } else if (step === 2) {
      isValid = await methods.trigger('configuration');
    }

    if (isValid) {
      setStep(targetStep);
    }
  };

  const nextStep = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    await validateAndMove(step + 1);
  };

  const prevStep = () => validateAndMove(step - 1);

  const onSubmit = (data: CreateTaskFormValues) => {
    // TODO - will not work with the update now
    if (taskId) {
      updateTask({ taskId, data });
      return;
    }
    if (intent === 'run') {
      createTaskAndRun(data);
    } else {
      createTask(data);
    }
  };

  const procedure = methods.watch('procedure');

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-2">
        <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-8xl mx-auto space-y-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {existingTask ? `Edit Analysis: ${existingTask?.name}` : 'New Analysis'}
              </h1>
              <p className="text-muted-foreground">Define your data mining task parameters.</p>
            </div>
            <NavBarWizard steps={STEPS} validateAndMove={validateAndMove} step={step} />
          </div>

          <Card className="border-0 shadow-lg ring-1 ring-gray-200">
            <CardContent className="p-6">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {step === 1 && (
                  <Step1TaskSetup datasets={datasets} isLoadingDataset={datasetsLoading} />
                )}
                {step === 2 && (
                  <Step2LogicBuilder
                    availableColumns={columns}
                    isLoading={isLoadingColumns}
                    procedure={procedure}
                  />
                )}
                {step === 3 && <Step3Quantifiers procedure={procedure} />}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t bg-gray-50/50 px-8 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="w-32"
              >
                Back
              </Button>

              {step === 3 ? (
                <div className="flex justify-between gap-4">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-48 bg-green-600 hover:bg-green-700"
                    onClick={() => setIntent('run')}
                  >
                    {isPending ? 'Starting Mining...' : 'Run Task'}
                  </Button>
                  <Button type="button" onClick={() => setIntent('save')} className="w-32">
                    Save Task
                  </Button>
                </div>
              ) : (
                <Button type="button" onClick={nextStep} className="w-32">
                  Next Step
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </div>
    </FormProvider>
  );
}
