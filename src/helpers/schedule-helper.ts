import { ScheduleType } from '../types';

const scheduleHelper = {
  getPreviousScheduleType(scheduleType: ScheduleType) {
    switch (scheduleType) {
      // case ScheduleType.PadConstruction: return pad.padConstructionStart
      // case ScheduleType.Rig: return ScheduleType.PadConstruction
      case ScheduleType.Frac: return ScheduleType.Drill
      case ScheduleType.DrillOut: return ScheduleType.Frac
      case ScheduleType.Facilities: return ScheduleType.DrillOut
      // case ScheduleType.Flowback: return ScheduleType.Facilities
      default: throw new Error('padHelper getScheduleStartDate() is not configured to handle ScheduleType ' + scheduleType)
    }
  }
}

export default scheduleHelper