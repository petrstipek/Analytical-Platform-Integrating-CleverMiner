export type LogicSection = 'target' | 'ante' | 'succ' | 'cond' | 'set1' | 'set2';

export const LOGIC_LAYOUTS: Record<string, LogicSection[]> = {
  SD4ftMiner: ['ante', 'succ', 'cond', 'set1', 'set2'],
  CFMiner: ['target', 'cond'],
  UICMiner: ['target', 'ante', 'cond'],
  '4ftMiner': ['ante', 'succ', 'cond'],
};

export const SECTION_LABELS: Record<LogicSection, string> = {
  target: 'Target Attribute',
  ante: 'Antecedent (IF)',
  succ: 'Succedent (THEN)',
  cond: 'Condition (Filter)',
  set1: 'Set 1 Population',
  set2: 'Set 2 Population',
};
