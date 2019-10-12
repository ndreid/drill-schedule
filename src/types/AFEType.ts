export type AFEType = 'construction' | 'drillRehab' | 'completionsRehab' | 'waterTransfer' | 'vertDrill' | 'horzDrill' | 'frac' | 'drillOut' | 'facilities' | 'flowback'
type AFETypeKeys = 'Construction' | 'DrillRehab' | 'CompletionsRehab' | 'WaterTransfer' | 'VertDrill' | 'HorzDrill' | 'Frac' | 'DrillOut' | 'Facilities' | 'Flowback'

export const AFEType: Record<AFETypeKeys, AFEType> = Object.freeze({
  Construction: 'construction',
  DrillRehab: 'drillRehab',
  CompletionsRehab: 'completionsRehab',
  WaterTransfer: 'waterTransfer',
  VertDrill: 'vertDrill',
  HorzDrill: 'horzDrill',
  Frac: 'frac',
  DrillOut: 'drillOut',
  Facilities: 'facilities',
  Flowback: 'flowback',
})