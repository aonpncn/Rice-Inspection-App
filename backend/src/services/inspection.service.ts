import { Grain, Standard } from '@/types/inspection';
import raw from '../../raw.json';
import standards from '../../standards.json';

export function calculateInspectionResult(standardId: string) {
  
  const grains = raw.grains as Grain[];
  const standardList = standards as Standard[];
  const standard = standardList.find((s) => s.id === standardId);

  if (!standard) throw new Error('Standard not found');

  const totalWeight = grains.reduce((sum, g) => sum + g.weight, 0);

  // Composition
  const compositionResult: Record<string, number> = {};
  for (const sub of standard.standardData) {
    const matchedWeight = grains
      .filter((g) => checkGrainMatch(g, sub))
      .reduce((sum, g) => sum + g.weight, 0);

    const percent = +(matchedWeight / totalWeight * 100).toFixed(2);
    compositionResult[sub.name] = percent;
  }

  // Defect
  const defectResult: Record<string, number> = {};
  for (const g of grains) {
    if (g.type !== 'white') {
      if (!defectResult[g.type]) defectResult[g.type] = 0;
      defectResult[g.type] += g.weight;
    }
  }

  // Convert to percent
  Object.keys(defectResult).forEach((type) => {
    defectResult[type] = +(defectResult[type] / totalWeight * 100).toFixed(2);
  });

return {
  composition: Object.entries(compositionResult).map(([name, percent]) => ({
    name,
    percent,
  })),
  defect: Object.entries(defectResult).map(([type, percent]) => ({
    type,
    percent,
  })),
};

}

function checkGrainMatch(grain: Grain, sub: Standard['standardData'][0]) {
  const { length, shape } = grain;

  const matchMin = compare(length, sub.conditionMin, sub.minLength);
  const matchMax = compare(length, sub.conditionMax, sub.maxLength);
  const matchShape = sub.shape.includes(shape);

  return matchMin && matchMax && matchShape;
}

function compare(value: number, condition: string, compareTo: number): boolean {
  switch (condition) {
    case 'LT': return value < compareTo;
    case 'LE': return value <= compareTo;
    case 'GT': return value > compareTo;
    case 'GE': return value >= compareTo;
    default: return false;
  }
}
