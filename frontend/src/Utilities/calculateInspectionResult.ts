import { Grain, CompositionItem, DefectItem } from '@/types'
import { StandardDefinition } from '@/data/standards'

export interface InspectionResult {
  totalSample: number
  composition: CompositionItem[]
  defects: DefectItem[]
}

export function calculateInspectionResult(
  grains: Grain[],
  standard: StandardDefinition
): InspectionResult {
  const totalWeight = grains.reduce((sum, g) => sum + g.weight, 0)

  console.log('standard', standard)
  const composition: CompositionItem[] = standard.composition.map((rule) => {
    const filtered = grains.filter((g) => {
      return (
        (rule.lengthMin === undefined || g.length >= rule.lengthMin) &&
        (rule.lengthMax === undefined || g.length <= rule.lengthMax)
      )
    })

    const weight = filtered.reduce((sum, g) => sum + g.weight, 0)
    return {
      name: rule.name,
      lengthRange: [
        rule.lengthMin !== undefined ? `>= ${rule.lengthMin}` : '',
        rule.lengthMax !== undefined ? `<= ${rule.lengthMax}` : '',
      ]
        .filter(Boolean)
        .join(' - '),
      actual: (weight / totalWeight) * 100,
    }
  })

  const defects: DefectItem[] = standard.defects.map((def) => {
    const weight = grains
      .filter((g) => g.type === def.type)
      .reduce((sum, g) => sum + g.weight, 0)
    return {
      name: def.name,
      actual: (weight / totalWeight) * 100,
    }
  })

  const nonWhiteWeight = grains
    .filter((g) => g.type !== 'white')
    .reduce((sum, g) => sum + g.weight, 0)

  defects.push({
    name: 'ข้าวปลอมปนทั้งหมด',
    actual: (nonWhiteWeight / totalWeight) * 100,
  })

  return {
    totalSample: grains.length,
    composition,
    defects,
  }
}
