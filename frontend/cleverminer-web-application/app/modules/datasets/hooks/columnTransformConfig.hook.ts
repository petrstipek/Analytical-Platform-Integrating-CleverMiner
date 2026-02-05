import { useMemo, useState } from 'react';
import {
  labelsMatchBins,
  parseBins,
  parseConstant,
  parseLabels,
} from '@/modules/datasets/utils/transformUi';

export type ColumnTransformConfig = {
  overwriteOriginal: boolean;
  outputColumn: string;
  explicitBins: string;
  explicitLabels: string;
  constantValue: string;
  binK: number;
};

const initial: ColumnTransformConfig = {
  overwriteOriginal: true,
  outputColumn: '',
  explicitBins: '',
  explicitLabels: '',
  constantValue: '',
  binK: 5,
};

export function useColumnTransformConfig(columnName: string) {
  const [config, setConfig] = useState<ColumnTransformConfig>(initial);

  const updateConfig = (patch: Partial<ColumnTransformConfig>) =>
    setConfig((prev) => ({ ...prev, ...patch }));

  const constantParsed = useMemo(() => parseConstant(config.constantValue), [config.constantValue]);

  const binsArray = useMemo(() => parseBins(config.explicitBins), [config.explicitBins]);
  const labelsArray = useMemo(() => parseLabels(config.explicitLabels), [config.explicitLabels]);

  const labelsOk = useMemo(() => labelsMatchBins(labelsArray, binsArray), [labelsArray, binsArray]);

  const defaultOutputCol = `${columnName}_bin`;

  const resolvedOutputCol = useMemo(() => {
    if (config.overwriteOriginal) return columnName;
    return config.outputColumn.trim() || defaultOutputCol;
  }, [config.overwriteOriginal, config.outputColumn, columnName, defaultOutputCol]);

  return {
    config,
    updateConfig,
    derived: {
      constantParsed,
      binsArray,
      labelsArray,
      labelsOk,
      defaultOutputCol,
      resolvedOutputCol,
    },
  };
}
