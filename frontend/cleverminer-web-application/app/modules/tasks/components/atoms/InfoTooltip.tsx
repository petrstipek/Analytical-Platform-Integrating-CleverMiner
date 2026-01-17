import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/atoms/tooltip';
import { Info } from 'lucide-react';

export default function InfoTooltip({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Info className="text-muted-foreground h-3.5 w-3.5 cursor-help opacity-70 hover:opacity-100" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-xs">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
