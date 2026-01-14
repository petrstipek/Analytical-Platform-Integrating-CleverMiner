import { useFormContext } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { DatasetsColumnsType } from '@/modules/datasets/domain/datasetsColumns.type';
import { FormControl, FormField, FormItem, FormMessage } from '@/shared/components/ui/form';

type AttributeSelectorProps = {
  name: string;
  columns: DatasetsColumnsType[];
  disabled?: boolean;
};

export default function AttributeSelector({ name, columns, disabled }: AttributeSelectorProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-[200px]">
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Column" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {columns.map((col) => (
                <SelectItem key={col.name} value={col.name}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{col.name}</span>
                    <span className="text-muted-foreground ml-auto text-xs">{col.dtype}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
