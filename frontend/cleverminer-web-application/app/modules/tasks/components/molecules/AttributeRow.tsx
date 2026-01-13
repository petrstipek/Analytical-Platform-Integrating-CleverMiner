import { X } from 'lucide-react';
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

interface AttributeRowProps {
  attribute: AttributeSpec;
  onChange: (updated: AttributeSpec) => void;
  onRemove: () => void;
}

export default function AttributeRow({ attribute, onChange, onRemove }: AttributeRowProps) {
  const updateField = (field: keyof AttributeSpec, value: any) => {
    onChange({ ...attribute, [field]: value });
  };

  return (
    <div className="bg-card flex items-end gap-3 rounded-md border p-3">
      <div className="flex-1 space-y-1">
        <span className="text-muted-foreground text-xs font-medium">Column</span>
        <Input
          placeholder="e.g. AGE"
          value={attribute.name}
          onChange={(e) => updateField('name', e.target.value)}
          className="h-8"
        />
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
