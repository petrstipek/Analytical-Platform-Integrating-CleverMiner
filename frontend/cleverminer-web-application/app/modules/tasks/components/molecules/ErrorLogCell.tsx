import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/molecules/dialog';

export default function ErrorLogCell({ errorLog }: { errorLog: string }) {
  const [open, setOpen] = useState(false);
  const lastLine =
    errorLog
      .trim()
      .split('\n')
      .filter(Boolean)
      .at(-1)
      ?.replace(/^\w+:\s*/, '') ?? '';

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:bg-destructive/10 gap-1"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <AlertCircle className="h-4 w-4" />
        <span className="text-xs">View Error</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Run Error
            </DialogTitle>
          </DialogHeader>
          <p className="text-destructive text-sm font-medium">{lastLine}</p>
          <pre className="bg-muted text-muted-foreground mt-2 max-h-80 overflow-auto rounded-md p-4 text-xs">
            {errorLog}
          </pre>
        </DialogContent>
      </Dialog>
    </>
  );
}
