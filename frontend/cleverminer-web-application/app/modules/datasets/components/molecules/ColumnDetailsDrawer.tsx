import { Button } from '@/shared/components/ui/atoms/button';
import { Badge } from '@/shared/components/ui/atoms/badge';
import { ScrollArea } from '@/shared/components/ui/molecules/scroll-area';
import { DataTypeIcon } from '@/modules/datasets/components/atoms';
import { AlertCircle, BarChart2, Eraser, Hash, Layers, Trash2 } from 'lucide-react';
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
import {
  DiscretizeStrategiesOptions,
  type DiscretizeStrategy,
  FillnaStrategiesOptions,
  type FillnaStrategy,
  TransformOptions,
  type TransformStep,
} from '@/modules/datasets/domain/datasetTransformations.type';
import { useCallback, useState } from 'react';
import { Input } from '@/shared/components/ui/atoms/input';
import { Label } from '@/shared/components/ui/atoms/label';
import { useColumnTransformConfig } from '@/modules/datasets/hooks/columnTransformConfig.hook';
import { parseConstant, stepLabel } from '@/modules/datasets/utils/transformUi';
import { Checkbox } from '@/shared/components/ui/atoms/checkbox';
import type { CheckedState } from '@radix-ui/react-checkbox';

type ColumnDetailsDrawerProps = {
  column: DatasetColumnStats | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStep: (step: TransformStep) => void;
  onRemoveStep: (index: number) => void;
  stagedSteps: TransformStep[];
};

export default function ColumnDetailsDrawer({
  column,
  open,
  onOpenChange,
  onAddStep,
  onRemoveStep,
  stagedSteps,
}: ColumnDetailsDrawerProps) {
  if (!column) return null;

  const { config, updateConfig, derived } = useColumnTransformConfig(column.name);
  const addStep = useCallback((step: TransformStep) => onAddStep(step), [onAddStep]);
  const strategies = Object.values(FillnaStrategiesOptions) as FillnaStrategy[];
  const [fillNaStrategy, setFillnaStrategy] = useState<FillnaStrategy>(
    FillnaStrategiesOptions.mean,
  );
  const discretizationStrategies = Object.values(
    DiscretizeStrategiesOptions,
  ) as DiscretizeStrategy[];
  const [discretizationStrategy, setDiscretizationStrategy] = useState<DiscretizeStrategy>();

  const addColumnStep = useCallback(
    <T extends Extract<TransformStep, { column: string }>>(
      op: T['op'],
      payload: Omit<T, 'op' | 'column'>,
    ) => {
      onAddStep({
        op,
        column: column.name,
        ...(payload as any),
      } as T);
    },
    [onAddStep, column.name],
  );

  const applyDiscretize = () => {
    if (discretizationStrategy === DiscretizeStrategiesOptions.explicit) {
      addColumnStep(TransformOptions.discretize, {
        method: 'explicit',
        bins: config.explicitBins,
        output_column: config.outputColumn,
      });
      return;
    }

    addColumnStep(TransformOptions.discretize, {
      discretizationStrategy,
      k: config.binK,
      output_column: config.outputColumn,
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="mt-0 h-full w-[95vw] max-w-[1000px] rounded-none">
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

                <section className="space-y-4">
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <Eraser className="h-4 w-4" />
                    <h4>Missing Values</h4>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {strategies.map((strategy) => (
                      <Button
                        key={strategy}
                        variant={fillNaStrategy === strategy ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setFillnaStrategy(strategy);
                          if (strategy !== FillnaStrategiesOptions.constant) {
                            addColumnStep(TransformOptions.fillMissingNumbers, { strategy });
                          }
                        }}
                      >
                        Fill with {strategy}
                      </Button>
                    ))}
                  </div>

                  {fillNaStrategy === FillnaStrategiesOptions.constant && (
                    <div className="grid gap-2">
                      <Label className="text-xs text-gray-600">Fill with constant</Label>
                      <div className="flex gap-2">
                        <Input
                          value={config.constantValue}
                          onChange={(e) => updateConfig({ constantValue: e.target.value })}
                          placeholder="e.g. 0 or Unknown"
                        />
                        <Button
                          variant={
                            fillNaStrategy === FillnaStrategiesOptions.constant
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() =>
                            addColumnStep(TransformOptions.fillMissingNumbers, {
                              strategy: 'constant',
                              value: parseConstant,
                            })
                          }
                          disabled={config.constantValue.trim() === ''}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  )}
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <Layers className="h-4 w-4" />
                    <h4>Binning / Discretization</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="overwrite"
                      checked={config.overwriteOriginal}
                      onCheckedChange={(checked: CheckedState) =>
                        updateConfig({ overwriteOriginal: checked === true })
                      }
                    />
                    <Label htmlFor="overwrite" className="text-xs text-gray-700">
                      Overwrite original column
                    </Label>
                  </div>
                  {config.overwriteOriginal && (
                    <div className="grid gap-2">
                      <Label className="text-xs text-gray-600">Output column</Label>
                      <Input
                        value={config.outputColumn}
                        onChange={(e) => updateConfig({ outputColumn: e.target.value })}
                        placeholder={derived.defaultOutputCol}
                      />
                      <p className="text-[11px] text-gray-500">
                        Leave empty to use{' '}
                        <span className="font-mono">{derived.defaultOutputCol}</span>
                      </p>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label className="text-xs text-gray-600">Number of bins (k)</Label>
                    <Input
                      type="number"
                      min={2}
                      value={config.binK}
                      onChange={(e) => updateConfig({ binK: Number(e.target.value) })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={
                        discretizationStrategy === DiscretizeStrategiesOptions.quantile
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => {
                        setDiscretizationStrategy(DiscretizeStrategiesOptions.quantile);
                        addColumnStep(TransformOptions.discretize, {
                          method: 'quantile',
                          k: config.binK,
                          output_column: config.overwriteOriginal
                            ? column.name
                            : `${column.name}_bin`,
                        });
                      }}
                    >
                      Quantiles ({config.binK} bins)
                    </Button>

                    <Button
                      variant={
                        discretizationStrategy === DiscretizeStrategiesOptions.equal_width
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => {
                        setDiscretizationStrategy(DiscretizeStrategiesOptions.equal_width);
                        addColumnStep(TransformOptions.discretize, {
                          method: 'equal_width',
                          k: config.binK,
                          output_column: config.overwriteOriginal
                            ? column.name
                            : `${column.name}_bin`,
                        });
                      }}
                    >
                      Equal Width ({config.binK} bins)
                    </Button>
                    <Button
                      variant={
                        discretizationStrategy === DiscretizeStrategiesOptions.explicit
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() =>
                        setDiscretizationStrategy(DiscretizeStrategiesOptions.explicit)
                      }
                    >
                      Explicit
                    </Button>
                  </div>

                  {discretizationStrategy === DiscretizeStrategiesOptions.explicit && (
                    <div className="mt-4 space-y-2 rounded-md border bg-white p-3">
                      <div className="text-sm font-semibold text-gray-900">Explicit bins</div>

                      <div className="grid gap-2">
                        <Label className="text-xs text-gray-600">
                          Bins (comma or space separated)
                        </Label>
                        <Input
                          value={config.explicitBins}
                          onChange={(e) => updateConfig({ explicitBins: e.target.value })}
                          placeholder="e.g. 0, 10, 20, 50"
                        />
                        <p className="text-[11px] text-gray-500">
                          Must be strictly increasing. Needs at least 2 numbers.
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label className="text-xs text-gray-600">Labels (optional)</Label>
                        <Input
                          value={config.explicitLabels}
                          onChange={(e) => updateConfig({ explicitLabels: e.target.value })}
                          placeholder="e.g. low, mid, high"
                        />
                        {!derived.labelsOk && (
                          <p className="text-[11px] text-red-600">
                            Labels count must equal bins.length - 1.
                          </p>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        disabled={!derived.binsArray || !derived.labelsOk}
                        onClick={() =>
                          addColumnStep(TransformOptions.discretize, {
                            method: 'explicit',
                            bins: derived.binsArray!,
                            labels: derived.labelsArray,
                            output_column: derived.resolvedOutputCol,
                          })
                        }
                      >
                        Apply Explicit Binning
                      </Button>
                    </div>
                  )}
                </section>

                <section className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Trash2 className="h-4 w-4 text-gray-500" /> Column Management
                  </h4>
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      addStep({ op: TransformOptions.dropColumns, columns: [column.name] });
                    }}
                  >
                    Drop Entire Column
                  </Button>
                </section>

                <div className="space-y-3">
                  {stagedSteps.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No transformations selected yet.</p>
                  )}
                  {stagedSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded border bg-white p-2 text-sm shadow-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold text-blue-600">{step.op}</span>
                        <span className="text-[10px] text-gray-500">{stepLabel(step)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-400"
                        onClick={() => onRemoveStep(idx)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
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
