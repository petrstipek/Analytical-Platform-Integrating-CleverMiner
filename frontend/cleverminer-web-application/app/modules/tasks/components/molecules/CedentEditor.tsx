import { Plus, Settings2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { AttributeType, GaceType } from '../../domain/task-schema';
import type { CedentConfig } from '../../domain/task-schema';
import AttributeRow from './AttributeRow';

interface CedentEditorProps {
  title: string;
  description: string;
  config: CedentConfig;
  onChange: (newConfig: CedentConfig) => void;
}

export default function CedentEditor({ title, description, config, onChange }: CedentEditorProps) {
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
      <div className="flex items-center justify-between border-b pb-2">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            {title}
            <Badge variant="outline" className="text-xs font-normal">
              {config.type === 'con' ? 'Conjunction' : 'Disjunction'}
            </Badge>
          </h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onChange({ ...config, type: config.type === 'con' ? 'dis' : 'con' })}
        >
          <Settings2 className="mr-2 h-4 w-4" />
          Switch to {config.type === 'con' ? 'Disjunction' : 'Conjunction'}
        </Button>
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
            />
          ))
        )}
      </div>

      <Button variant="outline" className="w-full border-dashed" onClick={addAttribute}>
        <Plus className="mr-2 h-4 w-4" /> Add Attribute
      </Button>
    </div>
  );
}
