export type FourftRule = {
  id: number;
  text: string;
  quantifiers: {
    base: number;
    rel_base: number;
    conf: number;
    fourfold: number[];
    aad?: number;
    bad?: number;
  };
};

export type Sd4ftRule = {
  id: number;
  text: string;
  quantifiers: {
    base1: number;
    base2: number;
    rel_base1: number;
    rel_base2: number;
    conf1: number;
    conf2: number;
    deltaconf: number;
    ratioconf: number;
    fourfold1: number[];
    fourfold2: number[];
  };
};

export type UicRule = {
  id: number;
  text: string;
  quantifiers: null;
  histogram_rule: number[];
  histogram_background: number[];
};

export type CfRule = {
  id: number;
  text: string;
  quantifiers: {
    base: number;
    rel_base: number;
    min: number;
    max: number;
    rel_min: number;
    rel_max: number;
    hist: number[];
    s_up?: number;
    s_down?: number;
    s_any_up?: number;
    s_any_down?: number;
  };
};
