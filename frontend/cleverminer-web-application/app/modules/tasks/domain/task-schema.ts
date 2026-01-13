export enum AttributeType {
  SUBSET = 'subset',
  LCUT = 'lcut',
  RCUT = 'rcut',
  SEQ = 'seq',
  ONE = 'one',
}

export enum GaceType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  BOTH = 'both',
}

export interface AttributeSpec {
  name: string;
  attr_type: AttributeType;
  minlen: number;
  maxlen: number;
  gace: GaceType;
}

export interface CedentConfig {
  attributes: AttributeSpec[];
  minlen: number;
  maxlen: number;
  type: 'con' | 'dis';
}

export type QuantifiersConfig = Record<string, number | null>;

export interface TaskConfiguration {
  target?: string;

  ante: CedentConfig;
  succ?: CedentConfig;
  cond?: CedentConfig | null;
  set1?: CedentConfig;
  set2?: CedentConfig;

  quantifiers: QuantifiersConfig;

  opts?: {
    max_categories?: number | null;
    no_optimizations?: boolean;
  };
}

export interface CreateTaskPayload {
  name: string;
  dataset: number;
  procedure: string;
  configuration: TaskConfiguration;
}
