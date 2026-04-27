import { AlertTriangle, Binary, Type, X } from 'lucide-react';
import { Input } from '@/shared/components/ui/atoms/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/atoms/select';
import { Button } from '@/shared/components/ui/atoms/button';
import { AttributeType, type AttributeSpec } from '../../domain/task-schema';
import type { DatasetsColumnsType } from '@/modules/datasets/domain/datasetsColumns.type';
import { useQuery } from '@tanstack/react-query';
import { getDatasetColumnValues } from '@/modules/datasets/api/datasets.api';

interface AttributeRowProps {
  attribute: AttributeSpec;
  onChange: (updated: AttributeSpec) => void;
  onRemove: () => void;
  availableColumns?: DatasetsColumnsType[];
  datasetId: number;
}

export default function AttributeRow({
  attribute,
  onChange,
  onRemove,
  availableColumns,
  datasetId,
}: AttributeRowProps) {
  const isOne = attribute.attr_type === AttributeType.ONE;
  const columnName = attribute.name;

  const updateField = (field: keyof AttributeSpec, value: any) => {
    onChange({ ...attribute, [field]: value });
  };

  const handleTypeChange = (newType: AttributeType) => {
    if (newType === AttributeType.ONE) {
      onChange({
        ...attribute,
        attr_type: newType,
        minlen: undefined,
        maxlen: undefined,
        value: undefined,
      });
    } else {
      onChange({ ...attribute, attr_type: newType, minlen: 1, maxlen: 1, value: undefined });
    }
  };

  const { data: columnValuesData, isLoading: isLoadingValues } = useQuery({
    queryKey: ['dataset-column-values', datasetId, columnName],
    queryFn: () => getDatasetColumnValues(datasetId, columnName),
    enabled: isOne && !!columnName,
    staleTime: 5 * 60 * 1000,
  });

  const selectedColumn = availableColumns?.find((col) => col.name === attribute.name);
  const hasTooManyValues = (selectedColumn?.distinct ?? 0) > 100;

  return (
    <div className="bg-card flex flex-col gap-2 rounded-md border p-3">
      {/* Input Row */}
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-1">
          <span className="text-muted-foreground text-xs font-medium">Column</span>
          <Select value={attribute.name} onValueChange={(val) => updateField('name', val)}>
            <SelectTrigger className="h-8 w-full bg-white">
              <SelectValue placeholder="Select column" />
            </SelectTrigger>
            <SelectContent>
              {(availableColumns?.length ?? 0) > 0 ? (
                availableColumns?.map((col) => (
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
        </div>

        <div className="w-[110px] space-y-1">
          <span className="text-muted-foreground text-xs font-medium">Type</span>
          <Select
            value={attribute.attr_type}
            onValueChange={(v) => handleTypeChange(v as AttributeType)}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(AttributeType).map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isOne ? (
          <div className="w-[120px] space-y-1">
            <span className="text-muted-foreground text-xs font-medium">Value</span>
            {!columnName ? (
              <Input className="h-8" placeholder="Select column first" disabled />
            ) : isLoadingValues ? (
              <div className="text-muted-foreground flex h-8 items-center text-xs">Loading...</div>
            ) : (columnValuesData?.values?.length ?? 0) > 0 ? (
              <Select
                value={attribute.value ?? ''}
                onValueChange={(val) => updateField('value', val)}
              >
                <SelectTrigger className="h-8 w-full bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {columnValuesData!.values.map((v: string) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                className="h-8"
                placeholder="Enter value"
                value={attribute.value ?? ''}
                onChange={(e) => updateField('value', e.target.value)}
              />
            )}
          </div>
        ) : (
          <div className="flex w-[120px] gap-2">
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs font-medium">Min</span>
              <Input
                type="number"
                className="mb-1 h-8"
                value={attribute.minlen ?? 1}
                min={1}
                onChange={(e) => updateField('minlen', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs font-medium">Max</span>
              <Input
                type="number"
                className="mb-1 h-8"
                value={attribute.maxlen ?? 1}
                min={1}
                onChange={(e) => updateField('maxlen', parseInt(e.target.value))}
              />
            </div>
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 h-8 w-8"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {hasTooManyValues && (
        <div className="flex items-center gap-1.5 rounded-sm border border-amber-100 bg-amber-50 px-2 py-1 text-[11px] text-amber-600">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          <p>
            <strong>{selectedColumn!.distinct} distinct values:</strong> This column is currently
            ignored by the miner (limit: 100). Try to reduce the number of distinct values by using
            preprocessing.
          </p>
        </div>
      )}
    </div>
  );
}
