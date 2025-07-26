export interface Grain {
  length: number;
  weight: number;
  shape: 'wholegrain' | 'broken';
  type: 'white' | 'yellow' | 'red' | 'damage' | 'paddy' | 'chalky' | 'glutinous';
}

export interface SubStandard {
  key: string;
  name: string;
  maxLength: number;
  minLength: number;
  conditionMax: 'LT' | 'LE' | 'GT' | 'GE';
  conditionMin: 'LT' | 'LE' | 'GT' | 'GE';
  shape: ('wholegrain' | 'broken')[];
}

export interface Standard {
  id: string;
  name: string;
  createDate: string;
  standardData: SubStandard[];
}

export interface History {
  id: string;
  name: string;
  createDate: string;
  inspectionID: string;
  standardID: string;
  note?: string;
  result: {
    composition: { name: string; percent: number }[];
    defect: { type: string; percent: number }[];
  };
}
