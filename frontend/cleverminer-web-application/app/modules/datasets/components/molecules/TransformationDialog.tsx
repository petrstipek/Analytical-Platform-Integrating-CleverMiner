import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from '@/shared/components/ui/molecules/dialog';
import { Input } from '@/shared/components/ui/atoms/input';
import { Button } from '@/shared/components/ui/atoms/button';
import { Play, Trash2 } from 'lucide-react';

type TransformationDialogProps = {
  derivedName: string;
  setDerivedName: (name: string) => void;
  handleTransformation: () => void;
  isPending: boolean;
  clearAll: () => void;
  onClose: () => void;
};

export default function TransformationDialog({
  derivedName,
  setDerivedName,
  handleTransformation,
  isPending,
  clearAll,
  onClose,
}: TransformationDialogProps) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Apply Dataset Transformation</DialogTitle>
        <DialogDescription>
          <div className={'space-y-4'}>
            <p>This action will apply the selected transformations to the dataset.</p>
            <p>
              New dataset will be created! You can later view the dataset in the Datasets overview
              or look at derived dataset in the Explore Dataset Transformations button on the top of
              this page.
            </p>
            <div className={'space-y-6'}>
              <div>
                <label className="flex items-center gap-2">Derived dataset name</label>
                <Input
                  placeholder="e.g. Derived Dataset 2024-01-01"
                  value={derivedName}
                  onChange={(e) => setDerivedName(e.target.value)}
                />
              </div>
              <div className={'flex flex-col gap-2'}>
                <Button
                  size="sm"
                  onClick={handleTransformation}
                  disabled={isPending}
                  className="bg-green-500"
                >
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  {isPending ? 'Applying...' : 'Apply All'}
                </Button>
                <Button
                  variant={'destructive'}
                  onClick={() => {
                    clearAll();
                    onClose();
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
