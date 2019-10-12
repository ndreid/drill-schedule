export const ScheduleType: Record<ScheduleTypeKeys, ScheduleType> = Object.freeze({
  Lateral: 'lateral',
  Construction: 'construction',
  Drill: 'drill',
  Frac: 'frac',
  DrillOut: 'drillOut',
  Facilities: 'facilities',
  Flowback: 'flowback'
})

export type ScheduleType = 'lateral' | 'construction' | 'drill' | 'frac' | 'drillOut' | 'facilities' | 'flowback'
export type ScheduleTypeKeys = 'Lateral' | 'Construction' | 'Drill' | 'Frac' | 'DrillOut' | 'Facilities' | 'Flowback'