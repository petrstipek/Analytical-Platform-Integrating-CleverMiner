export enum TransformOptions {
  fillMissingNumbers = 'fillna',
  dropColumns = 'drop_columns',
  dropRows = 'drop_rows',
  discretize = 'bin',
}

export enum FillnaStrategiesOptions {
  mean = 'mean',
  median = 'median',
  mode = 'mode',
  constant = 'constant',
}

export type FillnaStrategy = FillnaStrategiesOptions;

export enum DiscretizeStrategiesOptions {
  quantile = 'quantile',
  equal_width = 'equal_width',
  explicit = 'explicit',
}

export type DiscretizeStrategy = DiscretizeStrategiesOptions;

export type TransformFillnaStep = {
  op: TransformOptions.fillMissingNumbers;
  column: string;
  strategy: FillnaStrategy;
  value?: unknown;
};

export type TransformDropColumnsStep = {
  op: TransformOptions.dropColumns;
  columns: string[];
};

export type DropRowsWhere =
  | { column: string; is_null: true }
  | { column: string; lt: number }
  | { column: string; gt: number }
  | { column: string; in: (string | number | boolean | null)[] };

export type TransformDropRowsStep = {
  op: TransformOptions.dropRows;
  where: DropRowsWhere;
};

export type TransformBinStep =
  | {
      op: TransformOptions.discretize;
      column: string;
      method: DiscretizeStrategiesOptions.quantile | DiscretizeStrategiesOptions.equal_width;
      k: number;
      output_column?: string;
    }
  | {
      op: TransformOptions.discretize;
      column: string;
      method: DiscretizeStrategiesOptions.explicit;
      bins: number[];
      labels?: string[];
      output_column?: string;
    };

export type TransformStep =
  | TransformFillnaStep
  | TransformDropColumnsStep
  | TransformDropRowsStep
  | TransformBinStep;
