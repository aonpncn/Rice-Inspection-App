export interface CompositionRule {
  name: string;
  lengthMin?: number;
  lengthMax?: number;
}

export interface DefectRule {
  type: string;
  name: string;
}

export interface StandardDefinition {
  id: string;
  name: string;
  composition: CompositionRule[];
  defects: DefectRule[];
}

export const standards: StandardDefinition[] = [
  {
    id: 'standard1',
    name: 'Standard 1',
    composition: [
      { name: 'ข้าวเต็มเมล็ด', lengthMin: 7 },
      { name: 'ข้าวหักใหญ่', lengthMin: 3.5, lengthMax: 6.99 },
      { name: 'ข้าวหักธรรมดา', lengthMax: 3.49 },
    ],
    defects: [
      { type: 'yellow', name: 'ข้าวเหลือง' },
      { type: 'paddy', name: 'ข้าวเปลือก' },
      { type: 'damaged', name: 'ข้าวเสีย' },
      { type: 'glutinous', name: 'ข้าวเหนียว' },
      { type: 'chalky', name: 'ข้าวท้องไข่' },
      { type: 'red', name: 'ข้าวแดง' },
    ],
  },
  {
    id: 'standard2',
    name: 'Standard 2',
    composition: [
      { name: 'ข้าวเต็มเมล็ด', lengthMin: 6.8 },
      { name: 'ข้าวหักใหญ่', lengthMin: 3.0, lengthMax: 6.79 },
      { name: 'ข้าวหักธรรมดา', lengthMax: 2.99 },
    ],
    defects: [
      { type: 'yellow', name: 'ข้าวเหลือง' },
      { type: 'paddy', name: 'ข้าวเปลือก' },
      { type: 'damaged', name: 'ข้าวเสีย' },
      { type: 'glutinous', name: 'ข้าวเหนียว' },
      { type: 'chalky', name: 'ข้าวท้องไข่' },
      { type: 'red', name: 'ข้าวแดง' },
    ],
  },
]
