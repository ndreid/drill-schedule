import { PartialRecord, ScheduleType } from './'

export type Pad = {
  padID: number
  gisPadID: number
  padName: string
  batchDrill: boolean
  isScheduled: boolean
  activityCode: number
  isSplit: boolean
  temp: boolean
  manualDates: PartialRecord<ScheduleType, string>
  manualDurations: PartialRecord<ScheduleType, number>
  manualDelays: PartialRecord<ScheduleType, number>
  crews: PartialRecord<ScheduleType, number>
  predecessors: PartialRecord<ScheduleType, number>
  successors: PartialRecord<ScheduleType, number>
  wellCount?: number
  workingInterest?: number
  constructionCost?: number
  drillRehabCost?: number
  completionsRehabCost?: number
  waterTransferCost?: number
  vertDrillCost?: number
  horzDrillCost?: number
  fracCost?: number
  drillOutCost?: number
  facilitiesCost?: number
  flowbackCost?: number
  // lateralLength: number
  // fracStages: number
  constructionDurationDefault?: number
  constructionDuration?: number
  drillDurationDefault?: number
  drillDuration?: number
  fracDurationDefault?: number
  fracDuration?: number
  drillOutDurationDefault?: number
  drillOutDuration?: number
  facilitiesDurationDefault?: number
  facilitiesDuration?: number
  constructionStartDefault?: string
  constructionStart?: string
  constructionEnd?: string
  drillStartDefault?: string
  drillStart?: string
  drillEnd?: string
  fracStartDefault?: string
  fracStart?: string
  fracEnd?: string
  drillOutStartDefault?: string
  drillOutStart?: string
  drillOutEnd?: string
  facilitiesStartDefault?: string
  facilitiesStart?: string
  facilitiesEnd?: string
  til?: string
  firstFlow?: string
}

export type Pads = Record<number, Pad>