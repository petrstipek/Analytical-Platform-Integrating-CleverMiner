import { Hash, Plus, Settings2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { AttributeType, GaceType } from '../../domain/task-schema';
import type { CedentConfig } from '../../domain/task-schema';
import AttributeRow from './AttributeRow';
import type { DatasetsColumnsType } from '@/modules/datasets/domain/datasetsColumns.type';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/shared/components/ui/input';

interface CedentEditorProps {
  title: string;
  description: string;
  config: CedentConfig;
  onChange: (newConfig: CedentConfig) => void;
  availableColumns?: DatasetsColumnsType[];
}

export default function CedentEditor({
  title,
  description,
  config,
  onChange,
  availableColumns,
}: CedentEditorProps) {
  const addAttribute = () => {
    const newAttr = {
      name: '',
      attr_type: AttributeType.SUBSET,
      minlen: 1,
      maxlen: 1,
      gace: GaceType.POSITIVE,
    };
    onChange({ ...config, attributes: [...config.attributes, newAttr] });
  };

  const updateAttribute = (index: number, updated: any) => {
    const newAttrs = [...config.attributes];
    newAttrs[index] = updated;
    onChange({ ...config, attributes: newAttrs });
  };

  const removeAttribute = (index: number) => {
    const newAttrs = config.attributes.filter((_, i) => i !== index);
    onChange({ ...config, attributes: newAttrs });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-300">
      <div className="flex flex-col gap-4 border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              {title}
              <Badge
                variant={config.type === 'con' ? 'default' : 'secondary'}
                className="text-xs font-normal capitalize"
              >
                {config.type === 'con' ? 'Conjunction' : 'Disjunction'}
              </Badge>
            </h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onChange({ ...config, type: config.type === 'con' ? 'dis' : 'con' })}
          >
            <Settings2 className="mr-2 h-4 w-4" />
            Switch Type
          </Button>
        </div>

        <div className="bg-muted/30 flex items-center gap-4 rounded-md border p-3">
          <div className="flex items-center gap-2">
            <Hash className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground text-sm font-medium">Cedent Length:</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-muted-foreground text-xs">Min</Label>
              <Input
                type="number"
                className="h-8 w-16 bg-white"
                min={0}
                value={config.minlen}
                onChange={(e) => onChange({ ...config, minlen: parseInt(e.target.value) || 0 })}
              />
            </div>
            <span className="text-muted-foreground">-</span>
            <div className="flex items-center gap-2">
              <Label className="text-muted-foreground text-xs">Max</Label>
              <Input
                type="number"
                className="h-8 w-16 bg-white"
                min={1}
                value={config.maxlen}
                onChange={(e) => onChange({ ...config, maxlen: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
          <div className="text-muted-foreground ml-auto border-l pl-4 text-xs">
            (How many attributes can be combined)
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {config.attributes.length === 0 ? (
          <div className="text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed py-8 text-center">
            No attributes defined for this section yet.
          </div>
        ) : (
          config.attributes.map((attr, idx) => (
            <AttributeRow
              key={idx}
              attribute={attr}
              onChange={(updated: any) => updateAttribute(idx, updated)}
              onRemove={() => removeAttribute(idx)}
              availableColumns={availableColumns}
            />
          ))
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={addAttribute}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Attribute
      </Button>
    </div>
  );
}
