import type { DatasetChildren } from '@/modules/datasets/api/types/datasetChildrenTransfomration.type';
import { useState } from 'react';
import { TableCell, TableRow } from '@/shared/components/ui/organisms/table';
import { AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/shared/components/ui/atoms/badge';
import { cn } from '@/lib/utils';
import { TransformSteps } from '@/modules/datasets/components/molecules';
import { formatDate } from '@/shared/utils/formatDate';
import { Link } from 'react-router';
import { Button } from '@/shared/components/ui/atoms/button';

export default function DerivedChildDatasetRow({
  child,
  onNavigate,
}: {
  child: DatasetChildren;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const tr = child.transformation;

  const status = child.transformation.error_log ? 'error' : child.is_ready ? 'ready' : 'pending';

  return (
    <>
      <TableRow
        className="group hover:bg-muted/40 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <TableCell className="w-6 pr-0">
          {open ? (
            <ChevronDown className="text-muted-foreground h-4 w-4" />
          ) : (
            <ChevronRight className="text-muted-foreground h-4 w-4" />
          )}
        </TableCell>

        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <span>{child.dataset_name}</span>
          </div>
        </TableCell>

        <TableCell className="text-muted-foreground text-sm">
          {formatDate(child.created_at)}
        </TableCell>

        <TableCell>
          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              status === 'ready' &&
                'border-green-200 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
              status === 'pending' &&
                'border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
              status === 'error' &&
                'border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
            )}
          >
            {status === 'ready' ? 'Ready' : status === 'error' ? 'Error' : 'Pending'}
          </Badge>
        </TableCell>

        <TableCell>
          {status !== 'error' ? (
            <Link to={`/datasets/${child.dataset_id}`} onClick={onNavigate}>
              <Button variant={'outline'}>View Dataset</Button>
            </Link>
          ) : (
            <span className={'text-red-500'}>Dataset not available</span>
          )}
        </TableCell>
      </TableRow>

      {open && (
        <TableRow>
          <TableCell colSpan={5} className="max-w-0 pt-2 pb-4">
            <div className="bg-card space-y-3 overflow-hidden rounded-lg border p-4">
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-muted-foreground mb-0.5 text-xs">Dataset ID</p>
                  <p className="font-mono text-xs">{child.dataset_id}</p>
                </div>

                {tr && (
                  <>
                    <div>
                      <p className="text-muted-foreground mb-0.5 text-xs">Transformation ID</p>
                      <p className="font-mono text-xs">{tr.transformation_id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5 text-xs">Started</p>
                      <p className="text-xs">{formatDate(tr.started_at)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5 text-xs">Finished</p>
                      <p className="text-xs">{formatDate(tr.finished_at)}</p>
                    </div>
                  </>
                )}
              </div>

              {tr?.error_log && (
                <div className="border-destructive/30 bg-destructive/5 flex items-start gap-2 rounded-md border px-3 py-2">
                  <AlertCircle className="text-destructive mt-0.5 h-4 w-4 shrink-0" />
                  <p className="text-destructive font-mono text-xs leading-relaxed break-words whitespace-normal">
                    {tr.error_log}
                  </p>
                </div>
              )}

              {tr?.transform_spec && Object.keys(tr.transform_spec).length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-1 text-xs">Transform spec</p>
                  <TransformSteps spec={tr.transform_spec} />
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
