import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type CreateProjectFormValues,
  createProjectSchema,
} from '@/modules/projects/utils/project-validation';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/molecules/card';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/shared/components/ui/atoms/input';
import { Button } from '@/shared/components/ui/atoms/button';
import { useProjects } from '@/modules/projects/hooks/projects.hook';
import { Spinner } from '@/shared/components/ui/molecules/spinner';

export default function NewProject() {
  const { mutate: createNewProject, isPending } = useProjects();

  const methods = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const {
    register,
    formState: { errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-2">
        <form
          onSubmit={methods.handleSubmit((data) => createNewProject(data))}
          className="max-w-8xl mx-auto space-y-8"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">New Project</h1>
              <p className="text-muted-foreground">
                Define new project, you can update additional information when project is created.
              </p>
            </div>
          </div>

          <Card className="border-0 shadow-lg ring-1 ring-gray-200">
            <CardContent className="p-6">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <Label>Task Name</Label>
                  <Input {...register('name')} placeholder="e.g. Analyze Loan Defaults" />
                  {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4 border-t bg-gray-50/50 px-8">
              <Button type="submit" className="w-32" disabled={isPending}>
                {isPending && <Spinner />}
                {isPending ? 'Creating…' : 'Create Project'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </FormProvider>
  );
}
