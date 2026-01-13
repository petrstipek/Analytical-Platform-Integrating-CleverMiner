export type QuantifierGroup =
  | 'Base'
  | 'Relative Base'
  | 'Confidence'
  | 'Histogram Steps'
  | 'Extremes'
  | 'Bounds';

export interface QuantifierFieldDef {
  key: string;
  label: string;
  desc?: string;
  type: 'int' | 'float' | 'vector';
  group: QuantifierGroup;
}

export const QUANTIFIER_SCHEMAS: Record<string, QuantifierFieldDef[]> = {
  SD4ftMiner: [
    {
      key: 'FrstBase',
      label: 'First Base',
      desc: 'Min records in Set 1',
      type: 'int',
      group: 'Base',
    },
    {
      key: 'ScndBase',
      label: 'Second Base',
      desc: 'Min records in Set 2',
      type: 'int',
      group: 'Base',
    },
    {
      key: 'FrstRelBase',
      label: 'First Rel Base',
      desc: 'Percentage of Set 1',
      type: 'float',
      group: 'Relative Base',
    },
    {
      key: 'ScndRelBase',
      label: 'Second Rel Base',
      desc: 'Percentage of Set 2',
      type: 'float',
      group: 'Relative Base',
    },
    {
      key: 'Frstconf',
      label: 'First Confidence',
      desc: 'P(Succ|Ante) in Set 1',
      type: 'float',
      group: 'Confidence',
    },
    {
      key: 'Scndconf',
      label: 'Second Confidence',
      desc: 'P(Succ|Ante) in Set 2',
      type: 'float',
      group: 'Confidence',
    },
    {
      key: 'Deltaconf',
      label: 'Delta Conf (Δ)',
      desc: '|Conf1 - Conf2|',
      type: 'float',
      group: 'Confidence',
    },
    {
      key: 'Ratioconf',
      label: 'Ratio Conf',
      desc: 'Relative difference',
      type: 'float',
      group: 'Confidence',
    },
    {
      key: 'Ratioconf_leq',
      label: 'Ratio Conf Upper',
      desc: 'Max ratio',
      type: 'float',
      group: 'Confidence',
    },
  ],

  CFMiner: [
    { key: 'Base', label: 'Base', desc: 'Abs. number of records', type: 'int', group: 'Base' },
    {
      key: 'RelBase',
      label: 'Relative Base',
      desc: 'Base / Total records',
      type: 'float',
      group: 'Relative Base',
    },
    {
      key: 'S_Up',
      label: 'Steps Up',
      desc: 'Consecutive steps up',
      type: 'int',
      group: 'Histogram Steps',
    },
    {
      key: 'S_Down',
      label: 'Steps Down',
      desc: 'Consecutive steps down',
      type: 'int',
      group: 'Histogram Steps',
    },
    {
      key: 'S_Any_Up',
      label: 'Any Steps Up',
      desc: 'Total steps up',
      type: 'int',
      group: 'Histogram Steps',
    },
    {
      key: 'S_Any_Down',
      label: 'Any Steps Down',
      desc: 'Total steps down',
      type: 'int',
      group: 'Histogram Steps',
    },
    {
      key: 'Max',
      label: 'Max Value',
      desc: 'Maximal value in histogram',
      type: 'float',
      group: 'Extremes',
    },
    {
      key: 'Min',
      label: 'Min Value',
      desc: 'Minimal value in histogram',
      type: 'float',
      group: 'Extremes',
    },
    {
      key: 'RelMax',
      label: 'Rel Max',
      desc: 'Relative max value',
      type: 'float',
      group: 'Extremes',
    },
    {
      key: 'RelMin',
      label: 'Rel Min',
      desc: 'Relative min value',
      type: 'float',
      group: 'Extremes',
    },
    {
      key: 'RelMax_leq',
      label: 'Rel Max (Upper)',
      desc: 'Upper bound for RelMax',
      type: 'float',
      group: 'Bounds',
    },
    {
      key: 'RelMin_leq',
      label: 'Rel Min (Upper)',
      desc: 'Upper bound for RelMin',
      type: 'float',
      group: 'Bounds',
    },
  ],
  UICMiner: [
    { key: 'base', label: 'Base', desc: 'Min absolute records', type: 'int', group: 'Base' },
    {
      key: 'RelBase',
      label: 'Relative Base',
      desc: 'Base / Total records',
      type: 'float',
      group: 'Relative Base',
    },
    {
      key: 'aad_score',
      label: 'AAD Score',
      desc: 'Min interestingness score',
      type: 'float',
      group: 'Confidence',
    },
    {
      key: 'aad_weights',
      label: 'AAD Weights',
      desc: 'Weights for categories (e.g. 5,1,0)',
      type: 'vector',
      group: 'Confidence',
    },
  ],
  '4ftMiner': [
    {
      key: 'Base',
      label: 'Base',
      desc: 'Min absolute records (A & S)',
      type: 'int',
      group: 'Base',
    },
    {
      key: 'RelBase',
      label: 'Relative Base',
      desc: 'Base / Total records',
      type: 'float',
      group: 'Relative Base',
    },
    {
      key: 'conf',
      label: 'Confidence',
      desc: 'Probability P(Succ | Ante)',
      type: 'float',
      group: 'Confidence',
    },
    {
      key: 'aad',
      label: 'AAD (Above Avg Diff)',
      desc: 'How much Antecedent increases probability of Succedent (vs avg)',
      type: 'float',
      group: 'Confidence',
    },
    {
      key: 'bad',
      label: 'BAD (Below Avg Diff)',
      desc: 'Negative value of AAD (Decrease in probability)',
      type: 'float',
      group: 'Confidence',
    },
  ],
};
