export interface Grain {
  length: number
  weight: number
  shape: 'wholegrain' | 'broken'
  type: 'white' | 'chalky' | 'yellow' | 'damaged' | 'paddy' | 'foreign'
}

export interface CompositionItem {
  name: string
  lengthRange: string
  actual: number
  percent?: number
}

export interface DefectItem {
  name: string
  actual: number
  percent?: number
}

export interface Result {
  id: string
  standard: string
  createdAt: string
  updatedAt: string
  note?: string
  price?: number
  sampledAt?: string
  samplingPoint?: string[]
  imageURL: string
  rawGrains: Grain[]
}
