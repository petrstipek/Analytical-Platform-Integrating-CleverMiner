import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Step1TaskSetup, Step2LogicBuilder, Step3Quantifiers } from './wizard/';
import { createTaskSchema, type CreateTaskFormValues } from '@/modules/tasks/utils/task-validation';
import { useCreateTaskMutation } from '@/modules/tasks/hooks/tasks.hook';

export default function CreateTaskWizard() {
  const [step, setStep] = useState(1);
  const { mutate, isPending } = useCreateTaskMutation();

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

  const nextStep = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    let isValid = false;

    if (step === 1) {
      isValid = await methods.trigger(['name', 'dataset', 'procedure']);
    } else if (step === 2) {
      isValid = await methods.trigger('configuration');
    }

    if (isValid) setStep((p) => p + 1);
    else {
      // TODO - remove for production
      console.warn('Validation Failed for Step', step);
      console.log('Current Errors:', methods.formState.errors);
      console.log('Current Values:', methods.getValues());
    }
  };

  const prevStep = () => setStep((p) => p - 1);

  const onSubmit = (data: CreateTaskFormValues) => {
    mutate(data);
  };

  const procedure = methods.watch('procedure');

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="mx-auto max-w-4xl space-y-6 py-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Create New Analysis Task</h1>
            <span className="text-muted-foreground">Step {step} of 3</span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && 'Task Setup'}
                {step === 2 && 'Logic Configuration'}
                {step === 3 && 'Quantifiers & Thresholds'}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              {step === 1 && <Step1TaskSetup />}
              {step === 2 && <Step2LogicBuilder procedure={procedure} />}
              {step === 3 && <Step3Quantifiers procedure={procedure} />}
            </CardContent>

            <CardFooter className="bg-muted/20 flex justify-between py-4">
              <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
                Back
              </Button>

              {step === 3 ? (
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Starting Mining...' : 'Create & Run Task'}
                </Button>
              ) : (
                <Button type="button" onClick={nextStep}>
                  Next Step
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </form>
    </FormProvider>
  );
}
