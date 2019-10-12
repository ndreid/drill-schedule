import { ScheduleType } from '../types'

export const ScheduleTypeMap: Record<ScheduleType, number> & Record<number, ScheduleType> = Object.freeze({
  lateral: 1,
  construction: 2,
  drill: 3,
  frac: 4,
  drillOut: 5,
  facilities: 6,
  flowback: 7,
  1: ScheduleType.Lateral,
  2: ScheduleType.Construction,
  3: ScheduleType.Drill,
  4: ScheduleType.Frac,
  5: ScheduleType.DrillOut,
  6: ScheduleType.Facilities,
  7: ScheduleType.Flowback
})