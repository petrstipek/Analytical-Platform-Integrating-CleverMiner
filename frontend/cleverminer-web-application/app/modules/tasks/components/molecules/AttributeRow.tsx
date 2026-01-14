import { Binary, Type, X } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { AttributeType, type AttributeSpec } from '../../domain/task-schema';
import type { DatasetsColumnsType } from '@/modules/datasets/domain/datasetsColumns.type';

interface AttributeRowProps {
  attribute: AttributeSpec;
  onChange: (updated: AttributeSpec) => void;
  onRemove: () => void;
  availableColumns?: DatasetsColumnsType[];
}

export default function AttributeRow({
  attribute,
  onChange,
  onRemove,
  availableColumns,
}: AttributeRowProps) {
  const updateField = (field: keyof AttributeSpec, value: any) => {
    onChange({ ...attribute, [field]: value });
  };

  return (
    <div className="bg-card flex items-end gap-3 rounded-md border p-3">
      <div className="flex-1 space-y-1">
        <span className="text-muted-foreground text-xs font-medium">Column</span>
        <Select value={attribute.name} onValueChange={(val) => updateField('name', val)}>
          <SelectTrigger className="h-8 w-full bg-white">
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            {availableColumns?.length || 0 > 0 ? (
              availableColumns?.map((col) => (
                <SelectItem key={col.name} value={col.name}>
                  <div className="flex items-center gap-2">
                    {col.dtype.includes('int') || col.dtype.includes('float') ? (
                      <Binary className="h-3 w-3 text-blue-500" />
                    ) : (
                      <Type className="h-3 w-3 text-orange-500" />
                    )}
                    <span>{col.name}</span>
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
          onValueChange={(v: any) => updateField('attr_type', v as AttributeType)}
        >
          <SelectTrigger className="h-8">
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

      <div className="flex w-[120px] gap-2 space-y-1">
        <div>
          <span className="text-muted-foreground text-xs font-medium">Min</span>
          <Input
            type="number"
            className="h-8"
            value={attribute.minlen}
            onChange={(e) => updateField('minlen', parseInt(e.target.value))}
          />
        </div>
        <div>
          <span className="text-muted-foreground text-xs font-medium">Max</span>
          <Input
            type="number"
            className="h-8"
            value={attribute.maxlen}
            onChange={(e) => updateField('maxlen', parseInt(e.target.value))}
          />
        </div>
      </div>

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
  );
}
