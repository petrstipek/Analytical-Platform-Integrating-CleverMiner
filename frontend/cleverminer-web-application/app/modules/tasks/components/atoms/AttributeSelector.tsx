import { useFormContext } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/atoms/select';
import type { DatasetsColumnsType } from '@/modules/datasets/domain/datasetsColumns.type';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/components/ui/organisms/form';
import { AlertTriangle, Binary, Type } from 'lucide-react';

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
              <SelectTrigger className={'w-full'}>
                <SelectValue placeholder="Column" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {columns.length > 0 ? (
                columns.map((col) => (
                  <SelectItem key={col.name} value={col.name}>
                    <div className="flex items-center gap-2">
                      {col.dtype.includes('int') || col.dtype.includes('float') ? (
                        <Binary className="h-3 w-3 text-blue-500" />
                      ) : (
                        <Type className="h-3 w-3 text-orange-500" />
                      )}
                      <span>{col.name}</span>
                      {col.distinct > 100 && (
                        <AlertTriangle className="ml-auto h-3 w-3 text-amber-500" />
                      )}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <div className="text-muted-foreground p-2 text-xs">No columns loaded</div>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
