import { useFormContext } from 'react-hook-form';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { type CreateTaskFormValues } from '@/modules/tasks/utils/task-validation';
import type { DatasetType } from '@/modules/datasets/domain/dataset.type';

type Step1TaskSetupProps = {
  datasets?: DatasetType[];
};

export default function Step1TaskSetup({ datasets }: Step1TaskSetupProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateTaskFormValues>();

  const procedure = watch('procedure');
  const datasetWatch = watch('dataset');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Analysis Base Setup</h2>
        <p className="text-muted-foreground">Define name, procedure, and used dataset.</p>
      </div>
      <div className="space-y-2">
        <Label>Task Name</Label>
        <Input {...register('name')} placeholder="e.g. Analyze Loan Defaults" />
        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Dataset</Label>
          <Select
            value={String(datasetWatch)}
            onValueChange={(val) => setValue('dataset', parseInt(val), { shouldValidate: true })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select dataset..." />
            </SelectTrigger>
            <SelectContent>
              {datasets?.map((dataset) => (
                <SelectItem key={dataset.id} value={String(dataset.id)}>
                  {dataset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.dataset && <p className="text-destructive text-sm">{errors.dataset.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Procedure Method</Label>
          <Select
            value={procedure}
            onValueChange={(val) => setValue('procedure', val, { shouldValidate: true })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select procedure..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SD4ftMiner">SD4ftMiner</SelectItem>
              <SelectItem value="CFMiner">CFMiner</SelectItem>
              <SelectItem value="UICMiner">UICMiner</SelectItem>
              <SelectItem value="fourftMiner">4ftMiner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
