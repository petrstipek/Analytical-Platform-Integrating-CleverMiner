import { Button } from '@/shared/components/ui/atoms/button';
import { Badge } from '@/shared/components/ui/atoms/badge';
import { ScrollArea } from '@/shared/components/ui/molecules/scroll-area';
import { DataTypeIcon } from '@/modules/datasets/components/atoms';
import { BarChart2, Hash, AlertCircle } from 'lucide-react';
import type { DatasetColumnStats } from '@/modules/datasets/api/types/clmGuidance.type';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/components/ui/organisms/drawer';

type ColumnDetailsDrawerProps = {
  column: DatasetColumnStats | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ColumnDetailsDrawer({
  column,
  open,
  onOpenChange,
}: ColumnDetailsDrawerProps) {
  if (!column) return null;

  const formatAttrType = (type: string) => {
    const map: Record<string, string> = {
      lcut: 'Interval (Left Cut)',
      rcut: 'Interval (Right Cut)',
      seq: 'Sequential',
      subset: 'Subset (Nominal)',
      onehot: 'One-Hot Encoding',
    };
    return map[type] || type;
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="mt-0 h-full w-[85vw] rounded-none sm:w-[700px]">
        <div className="mx-auto flex h-full w-full flex-col">
          <DrawerHeader className="text-left">
            <div className="flex items-center gap-3">
              <DataTypeIcon type={column.dtype} />
              <DrawerTitle className="text-2xl">{column.name}</DrawerTitle>
              <Badge variant="outline" className="uppercase">
                {column.dtype}
              </Badge>
            </div>
            <DrawerDescription>
              Analysis and transformation options for this attribute.
            </DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="flex-1 overflow-y-auto px-4">
            <div className="flex flex-col gap-6 pb-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Unique Values</span>
                  <div className="flex items-center gap-2 font-mono text-lg font-medium">
                    <Hash className="h-4 w-4 text-gray-400" />
                    {column.clm_guidance?.stats?.nunique ?? column.nunique ?? '-'}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Missing Values</span>
                  <div className="flex items-center gap-2 font-mono text-lg font-medium">
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                    {column.clm_guidance?.stats?.nulls ?? column.nulls ?? '-'}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Non-Null Count</span>
                  <div className="flex items-center gap-2 font-mono text-lg font-medium">
                    <BarChart2 className="h-4 w-4 text-gray-400" />
                    {column.clm_guidance?.stats?.non_null ?? column.non_null ?? '-'}
                  </div>
                </div>
              </div>

              {column.clm_guidance?.reasons && column.clm_guidance.reasons.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Analysis Insights</h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                    {column.clm_guidance.reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Available Transformations</h4>
                {column.clm_guidance?.suggested_attribute_spec &&
                column.clm_guidance.suggested_attribute_spec.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {column.clm_guidance.suggested_attribute_spec.map((spec, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col justify-between rounded-md border p-3 shadow-sm hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-blue-700">
                            {formatAttrType(spec.attr_type)}
                          </span>
                          <code className="text-xs text-gray-400">{spec.attr_type}</code>
                        </div>
                        <div className="mt-2 flex gap-2 text-xs text-gray-500">
                          <span>Min: {spec.minlen}</span>
                          <span className="text-gray-300">|</span>
                          <span>Max: {spec.maxlen}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No specific transformations suggested (Ignored or Usable as-is).
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>

          <DrawerFooter className="mb-4">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
