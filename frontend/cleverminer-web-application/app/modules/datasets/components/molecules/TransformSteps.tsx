import {
  DiscretizeStrategiesOptions,
  FillnaStrategiesOptions,
  TransformOptions,
  type TransformStep,
} from '@/modules/datasets/domain/datasetTransformations.type';
import DerivedDatasetStepCard from '../atoms/DerivedDatasetStepCard';
import { Field, ValueBadge } from '@/modules/datasets/components/atoms';

type TransformationSpec = {
  steps: TransformStep[];
};

function TransformStepItem({ step, index }: { step: TransformStep; index: number }) {
  switch (step.op) {
    case TransformOptions.fillMissingNumbers:
      return (
        <DerivedDatasetStepCard index={index} title="Fill missing values">
          <Field label="Column" value={<span className="font-medium">{step.column}</span>} />
          <Field
            label="Strategy"
            value={<span className="font-medium capitalize">{step.strategy}</span>}
          />
          {step.strategy === FillnaStrategiesOptions.constant && (
            <Field
              label="Value"
              value={<span className="font-mono text-xs">{String(step.value)}</span>}
            />
          )}
        </DerivedDatasetStepCard>
      );

    case TransformOptions.dropColumns:
      return (
        <DerivedDatasetStepCard index={index} title="Drop columns">
          <div className={'flex flex-row'}>
            <span className="text-muted-foreground">Columns: </span>
            <div className="ml-2 flex flex-wrap">
              {step.columns.map((column) => (
                <ValueBadge key={column}>{column}</ValueBadge>
              ))}
            </div>
          </div>
        </DerivedDatasetStepCard>
      );

    case TransformOptions.discretize:
      if (step.method === DiscretizeStrategiesOptions.explicit) {
        return (
          <DerivedDatasetStepCard index={index} title="Discretize column">
            <Field label="Column" value={<span className="font-medium">{step.column}</span>} />
            <Field label="Method" value={<span className="font-medium">Explicit bins</span>} />

            <div>
              <span className="text-muted-foreground">Bins: </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {step.bins.map((bin, i) => (
                  <ValueBadge key={`${bin}-${i}`}>{bin}</ValueBadge>
                ))}
              </div>
            </div>

            {step.labels && step.labels.length > 0 && (
              <div>
                <span className="text-muted-foreground">Labels: </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {step.labels.map((label) => (
                    <ValueBadge key={label}>{label}</ValueBadge>
                  ))}
                </div>
              </div>
            )}

            {step.output_column && (
              <Field
                label="Output column"
                value={<span className="font-medium">{step.output_column}</span>}
              />
            )}
          </DerivedDatasetStepCard>
        );
      }

      return (
        <DerivedDatasetStepCard index={index} title="Discretize column">
          <Field label="Column" value={<span className="font-medium">{step.column}</span>} />
          <Field
            label="Method"
            value={
              <span className="font-medium">
                {step.method === DiscretizeStrategiesOptions.quantile ? 'Quantile' : 'Equal width'}
              </span>
            }
          />
          <Field label="Bins count" value={<span className="font-medium">{step.k}</span>} />
          {step.output_column && (
            <Field
              label="Output column"
              value={<span className="font-medium">{step.output_column}</span>}
            />
          )}
        </DerivedDatasetStepCard>
      );

    default:
      return (
        <DerivedDatasetStepCard index={index} title="Unknown transformation">
          <pre className="bg-muted overflow-x-auto rounded-md p-2 text-xs">
            {JSON.stringify(step, null, 2)}
          </pre>
        </DerivedDatasetStepCard>
      );
  }
}

export default function TransformSteps({ spec }: { spec: TransformationSpec }) {
  if (!spec.steps?.length) {
    return <p className="text-muted-foreground text-xs">No transformation steps.</p>;
  }

  return (
    <div className="space-y-2">
      {spec.steps.map((step, index) => (
        <TransformStepItem key={index} step={step} index={index} />
      ))}
    </div>
  );
}
