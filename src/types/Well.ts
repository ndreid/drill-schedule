import { PartialRecord, AFEType, DurationType } from './'

export type Well = {
  wellID: number
  lateralID: number
  padID: number
  predecessorWellID: number
  gpWellNo: number
  wellName: string
  phaseWindow: string
  formation: string
  districtTownship: string
  surfaceLocation: number
  lateralSite: string
  unitID: number
  unit: string
  section: number
  townshipRange: string
  workingInterest: number
  lateralLength: number
  tvd: number
  tmd: number
  spacingLeft: number
  spacingRight: number
  vertDrillOrderManual?: number
  horzDrillOrderManual?: number
  manualDurations: PartialRecord<DurationType, number>
  afes: PartialRecord<AFEType, number>
  avgSpacing?: number
  fracDesign?: string
  stagesPerDay?: number
  fracStages?: number
  vertDrillOrderDefault?: number
  vertDrillOrder?: number
  horzDrillOrderDefault?: number
  horzDrillOrder?: number
  vertDrillDurationDefault?: number
  vertDrillDuration?: number
  horzDrillDurationDefault?: number
  horzDrillDuration?: number
  drillDuration?: number
  fracDuration?: number
  drillOutDuration?: number
  constructionStart?: string
  constructionEnd?: string
  vertDrillStart?: string
  vertDrillEnd?: string
  horzDrillStart?: string
  horzDrillEnd?: string
  fracStart?: string
  fracEnd?: string
  drillOutStart?: string
  drillOutEnd?: string
  facilitiesStart?: string
  facilitiesEnd?: string
  til?: string
  firstFlow?: string
  constructionCostDefault?: number
  constructionCost?: number
  drillRehabCostDefault?: number
  drillRehabCost?: number
  completionsRehabCostDefault?: number
  completionsRehabCost?: number
  waterTransferCostDefault?: number
  waterTransferCost?: number
  vertDrillCostDefault?: number
  vertDrillCost?: number
  horzDrillCostDefault?: number
  horzDrillCost?: number
  fracCostDefault?: number
  fracCost?: number
  drillOutCostDefault?: number
  drillOutCost?: number
  facilitiesCostDefault?: number
  facilitiesCost?: number
  flowbackCostDefault?: number
  flowbackCost?: number
}

export type Wells = Record<number, Well>