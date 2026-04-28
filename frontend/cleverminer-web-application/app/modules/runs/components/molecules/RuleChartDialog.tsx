import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/molecules/dialog';
import { Button } from '@/shared/components/ui/atoms/button';
import { ImageIcon } from 'lucide-react';

interface RuleChartDialogProps {
  ruleId: number;
  chartUrl: string | undefined;
  chartLoading: boolean;
  onOpen: () => void;
}

export default function RuleChartDialog({
  ruleId,
  chartUrl,
  chartLoading,
  onOpen,
}: RuleChartDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" onClick={onOpen}>
          <ImageIcon className="mr-2 h-4 w-4" />
          Show CleverMiner Chart
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Rule {ruleId} — CleverMiner Chart</DialogTitle>
        </DialogHeader>
        {chartLoading ? (
          <div className="text-muted-foreground py-8 text-center text-sm">Loading chart...</div>
        ) : chartUrl ? (
          <img src={chartUrl} alt={`Rule ${ruleId} chart`} className="w-full rounded-lg" />
        ) : (
          <div className="text-muted-foreground py-8 text-center text-sm">Chart not available</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
