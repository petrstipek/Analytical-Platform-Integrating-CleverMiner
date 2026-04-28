import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/molecules/alert-dialog';
import { AlertTriangle } from 'lucide-react';

type HighCardinalityWarningProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offenders: string[];
  onConfirm: () => void;
};

export default function HighCardinalityWarning({
  open,
  onOpenChange,
  offenders,
  onConfirm,
}: HighCardinalityWarningProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Some attributes may be ignored
          </AlertDialogTitle>
          <AlertDialogDescription>
            The following attributes exceed 100 distinct values and will be skipped by the miner:{' '}
            <strong className="text-foreground">{offenders.join(', ')}</strong>. Consider applying a
            binning transformation first.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Go back and fix</AlertDialogCancel>
          <AlertDialogAction
            className="bg-amber-500 text-white hover:bg-amber-600"
            onClick={onConfirm}
          >
            Continue anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
