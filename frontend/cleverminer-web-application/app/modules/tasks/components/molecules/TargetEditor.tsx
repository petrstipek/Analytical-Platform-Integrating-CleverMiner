import { AttributeSelector } from '@/modules/tasks/components/atoms';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/molecules/card';
import { Target } from 'lucide-react';
import { Label } from '@/shared/components/ui/atoms/label';

type TargetEditorProps = {
  availableColumns: any[];
  isLoading: boolean;
};

export default function TargetEditor({ availableColumns, isLoading }: TargetEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Target className="text-primary h-5 w-5" /> Target Attribute
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label>Column Name</Label>
          <AttributeSelector
            name="configuration.target"
            columns={availableColumns}
            disabled={isLoading}
          />
          <p className="text-muted-foreground text-sm">
            The main attribute to analyze (histogram axis).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
