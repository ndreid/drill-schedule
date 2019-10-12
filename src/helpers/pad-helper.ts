import { Pad, ScheduleType } from '../types';
import { isNumber } from 'data-type-ext/_Number'

const padHelper = {
  getScheduleStartDate(pad: Pad, scheduleType: ScheduleType) {
    switch (scheduleType) {
      case ScheduleType.Construction: return pad.constructionStart
      case ScheduleType.Drill: return pad.drillStart
      case ScheduleType.Frac: return pad.fracStart
      case ScheduleType.DrillOut: return pad.drillOutStart
      case ScheduleType.Facilities: return pad.facilitiesStart
      case ScheduleType.Flowback: return pad.firstFlow
      default: throw new Error('padHelper getScheduleStartDate() is not configured to handle ScheduleType ' + scheduleType)
    }
  },

  getScheduleEndDate(pad: Pad, scheduleType: ScheduleType) {
    switch (scheduleType) {
      case ScheduleType.Construction: return pad.constructionEnd
      case ScheduleType.Drill: return pad.drillEnd
      case ScheduleType.Frac: return pad.fracEnd
      case ScheduleType.DrillOut: return pad.drillOutEnd
      case ScheduleType.Facilities: return pad.facilitiesEnd
      case ScheduleType.Flowback: return undefined
      default: throw new Error('padHelper getScheduleEndDate() is not configured to handle ScheduleType ' + scheduleType)
    }
  },
  
  getScheduleStartDateDefault(pad: Pad, scheduleType: ScheduleType) {
    switch (scheduleType) {
      case ScheduleType.Construction: return pad.constructionStartDefault
      case ScheduleType.Drill: return pad.drillStartDefault
      case ScheduleType.Frac: return pad.fracStartDefault
      case ScheduleType.DrillOut: return pad.drillOutStartDefault
      case ScheduleType.Facilities: return pad.facilitiesStartDefault
      case ScheduleType.Flowback: return pad.facilitiesEnd
      default: throw new Error('padHelper getScheduleStartDateDefault() is not configured to handle ScheduleType ' + scheduleType)
    }
  },

  getScheduleStartDateManual(pad: Pad, scheduleType: ScheduleType) {
    switch (scheduleType) {
      case ScheduleType.Construction: return isNumber(pad.manualDates[ScheduleType.Construction]) ? pad.manualDates[ScheduleType.Construction] : undefined
      case ScheduleType.Drill: return isNumber(pad.manualDates[ScheduleType.Drill]) ? pad.manualDates[ScheduleType.Drill] : undefined
      case ScheduleType.Frac: return isNumber(pad.manualDates[ScheduleType.Frac]) ? pad.manualDates[ScheduleType.Frac] : undefined
      case ScheduleType.DrillOut: return isNumber(pad.manualDates[ScheduleType.DrillOut]) ? pad.manualDates[ScheduleType.DrillOut] : undefined
      case ScheduleType.Facilities: return isNumber(pad.manualDates[ScheduleType.Facilities]) ? pad.manualDates[ScheduleType.Facilities] : undefined
      case ScheduleType.Flowback: return pad.til
      default: throw new Error('padHelper getScheduleStartDateManual() is not configured to handle ScheduleType ' + scheduleType)
    }
  },

  getScheduleDuration(pad: Pad, scheduleType: ScheduleType) {
    switch (scheduleType) {
      case ScheduleType.Construction: return pad.constructionDuration
      case ScheduleType.Drill: return pad.drillDuration
      case ScheduleType.Frac: return pad.fracDuration
      case ScheduleType.DrillOut: return pad.drillOutDuration
      case ScheduleType.Facilities: return pad.facilitiesDuration
      case ScheduleType.Flowback: return undefined
      default: throw new Error('padHelper getScheduleDuration() is not configured to handle ScheduleType ' + scheduleType)
    }
  },

  getScheduleDurationDefault(pad: Pad, scheduleType: ScheduleType) {
    switch (scheduleType) {
      case ScheduleType.Construction: return pad.constructionDurationDefault
      case ScheduleType.Drill: return pad.drillDurationDefault
      case ScheduleType.Frac: return pad.fracDurationDefault
      case ScheduleType.DrillOut: return pad.drillOutDurationDefault
      case ScheduleType.Facilities: return pad.facilitiesDurationDefault
      case ScheduleType.Flowback: return undefined
      default: throw new Error('padHelper getScheduleDurationDefault() is not configured to handle ScheduleType ' + scheduleType)
    }
  },

  getScheduleDurationManual(pad: Pad, scheduleType: ScheduleType) {
    switch (scheduleType) {
      case ScheduleType.Construction: return isNumber(pad.manualDurations[ScheduleType.Construction]) ? pad.manualDurations[ScheduleType.Construction] : undefined
      case ScheduleType.Drill: return isNumber(pad.manualDurations[ScheduleType.Drill]) ? pad.manualDurations[ScheduleType.Drill] : undefined
      case ScheduleType.Frac: return isNumber(pad.manualDurations[ScheduleType.Frac]) ? pad.manualDurations[ScheduleType.Frac] : undefined
      case ScheduleType.DrillOut: return isNumber(pad.manualDurations[ScheduleType.DrillOut]) ? pad.manualDurations[ScheduleType.DrillOut] : undefined
      case ScheduleType.Facilities: return isNumber(pad.manualDurations[ScheduleType.Facilities]) ? pad.manualDurations[ScheduleType.Facilities] : undefined
      case ScheduleType.Flowback: return undefined
      default: throw new Error('padHelper getScheduleDurationManual() is not configured to handle ScheduleType ' + scheduleType)
    }
  },

  getScheduleCost(pad: Pad, scheduleType: ScheduleType, getNet: boolean = false) {
    let cost = 0
    switch (scheduleType) {
      case ScheduleType.Construction: cost = pad.constructionCost; break
      case ScheduleType.Drill: cost = pad.vertDrillCost + pad.horzDrillCost; break
      case ScheduleType.Frac: cost = pad.fracCost; break
      case ScheduleType.DrillOut: cost = pad.drillOutCost; break
      case ScheduleType.Facilities: cost = pad.facilitiesCost; break
      case ScheduleType.Flowback: cost = pad.flowbackCost; break
      default: throw new Error('Pad.js getScheduleCost() is not configured to handle ScheduleType ' + scheduleType)
    }
    return getNet ? cost * pad.workingInterest : cost
  }
}

export default padHelper