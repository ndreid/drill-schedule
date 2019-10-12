/* eslint-disable default-case */
import { PadActionTypes,
         SET_PADS,
         SET_PAD_CONSTRUCTION_START, SET_PAD_CONSTRUCTION_END,
         SET_PAD_DRILL_START, SET_PAD_DRILL_END,
         SET_PAD_FRAC_START, SET_PAD_FRAC_END,
         SET_PAD_DRILL_OUT_START, SET_PAD_DRILL_OUT_END,
         SET_PAD_FACILITIES_START, SET_PAD_FACILITIES_END,
         SET_PAD_TIL, SET_PAD_FIRST_FLOW,
         SET_PAD_CREW,
         SET_PAD_PREDECESSOR,
         SET_PAD_SUCCESSOR,
         SET_PAD_CONSTRUCTION_COST,
         SET_PAD_VERT_DRILL_COST,
         SET_PAD_HORZ_DRILL_COST,
         SET_PAD_DRILL_REHAB_COST,
         SET_PAD_FRAC_COST,
         SET_PAD_COMPLETIONS_REHAB_COST,
         SET_PAD_WATER_TRANSFER_COST,
         SET_PAD_DRILL_OUT_COST,
         SET_PAD_FACILITIES_COST,
         SET_PAD_FLOWBACK_COST,
        //  SET_PAD_FRAC_STAGES,
         SET_PAD_WORKING_INTEREST,
         SET_PAD_CONSTRUCTION_DURATION,
         SET_PAD_DRILL_DURATION,
         SET_PAD_FRAC_DURATION,
         SET_PAD_DRILL_OUT_DURATION,
         SET_PAD_FACILITIES_DURATION,
         SET_PAD_CONSTRUCTION_START_DEFAULT,
         SET_PAD_DRILL_START_DEFAULT,
         SET_PAD_FRAC_START_DEFAULT,
         SET_PAD_DRILL_OUT_START_DEFAULT,
         SET_PAD_FACILITIES_START_DEFAULT,
         SET_PAD_CONSTRUCTION_START_MANUAL,
         SET_PAD_DRILL_START_MANUAL,
         SET_PAD_FRAC_START_MANUAL,
         SET_PAD_DRILL_OUT_START_MANUAL,
         SET_PAD_FACILITIES_START_MANUAL,
         SET_PAD_CONSTRUCTION_DURATION_MANUAL,
         SET_PAD_FRAC_DURATION_MANUAL,
         SET_PAD_DRILL_OUT_DURATION_MANUAL,
         SET_PAD_FACILITIES_DURATION_MANUAL,
         SET_PAD_CONSTRUCTION_DURATION_DEFAULT,
         SET_PAD_FRAC_DURATION_DEFAULT,
         SET_PAD_DRILL_OUT_DURATION_DEFAULT,
         SET_PAD_FACILITIES_DURATION_DEFAULT,
         SET_PAD_DRILL_DURATION_DEFAULT,
         SET_PAD_DRILL_DURATION_MANUAL,
         SET_PAD_DRILL_DELAY_MANUAL,
         SET_PAD_FRAC_DELAY_MANUAL,
         SET_PAD_DRILL_OUT_DELAY_MANUAL,
         SET_PAD_FACILITIES_DELAY_MANUAL,
         SET_BATCH_DRILL_FLAG,
         SET_WELL_COUNT,
         SET_PAD_IS_SCHEDULED,
         SPLIT_PAD,
         UNSPLIT_PAD,
         CREATE_TEMP_PAD,
         DELETE_TEMP_PAD,
         SET_PAD_NAME,
} from '../action-types/pad-action-types'
import { Pad, Pads, ScheduleType } from '../../types'
import { PartialRecord } from '../../types/PartialRecord';

// export const pads = (state = {}, { type, payload }) => {
export const pads = (state: Pads = {}, actionsObj): Pads => {
  let actions: PadActionTypes[] = Array.isArray(actionsObj) ? actionsObj : [actionsObj], newState = state
  for (let action of actions) {
    switch (action.type) {
      case SET_PADS:
        newState = action.payload
        break
      case CREATE_TEMP_PAD:
        //@ts-ignore
        newState = {
          ...newState,
          [action.payload.padID]: {
            padID: action.payload.padID,
            padName: action.payload.padName,
            batchDrill: false,
            isScheduled: false,
            activityCode: 0,
            isSplit: false,
            temp: true,
            wellCount: 0,
            manualDates: {},
            manualDurations: {},
            manualDelays: {},
            crews: {},
            predecessors: {},
            successors: {},            
          }
        }
        break
      // case SET_PAD_FRAC_STAGES:
      case DELETE_TEMP_PAD:
        let { [action.payload]: deletedPad, ...remainingPads } = newState
        newState = remainingPads
        break
      case SPLIT_PAD: {
        let p = newState[action.payload.padID]
        let activityCode = Math.max(...Object.values(newState).filter(pa => pa.gisPadID === p.gisPadID).map(pa => pa.activityCode)) + 1
        //@ts-ignore
        newState = {
          ...newState,
          [p.padID]: {
            ...p,
            padName: p.isSplit ? p.padName : p.padName + ' - 0',
            isSplit: true,
          },
          [action.payload.newPadID]: {
            padID: action.payload.newPadID,
            gisPadID: p.gisPadID,
            padName: (p.isSplit ? p.padName.substr(0, p.padName.length - 4) : p.padName) + ' - ' + activityCode,
            batchDrill: false,
            isScheduled: p.isScheduled,
            activityCode,
            isSplit: true,
            temp: false,
            wellCount: 0,
            manualDates: {},
            manualDurations: {},
            manualDelays: {},
            crews: {},
            predecessors: {},
            successors: {},
          }
        }
        break
      }
      case UNSPLIT_PAD: {
        let { [action.payload]: deletedPad, ...remainingPads } = newState
        newState = remainingPads
        if (deletedPad.activityCode === 1) {
          let origPad = Object.values(newState).find(p => p.gisPadID === deletedPad.gisPadID && p.activityCode === 0)
          newState = {
            ...newState,
            [origPad.padID]: {
              ...origPad,
              padName: origPad.padName.replace(' - 0', ''),
              isSplit: false,
            }
          }
        }
        break
      }
      case SET_PAD_NAME:
      case SET_PAD_WORKING_INTEREST:
      case SET_PAD_CONSTRUCTION_DURATION:
      case SET_PAD_DRILL_DURATION:
      case SET_PAD_FRAC_DURATION:
      case SET_PAD_DRILL_OUT_DURATION:
      case SET_PAD_FACILITIES_DURATION:
      case SET_PAD_CONSTRUCTION_DURATION_DEFAULT:
      case SET_PAD_DRILL_DURATION_DEFAULT:
      case SET_PAD_FRAC_DURATION_DEFAULT:
      case SET_PAD_DRILL_OUT_DURATION_DEFAULT:
      case SET_PAD_FACILITIES_DURATION_DEFAULT:
      case SET_PAD_CONSTRUCTION_DURATION_MANUAL:
      case SET_PAD_DRILL_DURATION_MANUAL:
      case SET_PAD_FRAC_DURATION_MANUAL:
      case SET_PAD_DRILL_OUT_DURATION_MANUAL:
      case SET_PAD_FACILITIES_DURATION_MANUAL:
      case SET_PAD_DRILL_DELAY_MANUAL:
      case SET_PAD_FRAC_DELAY_MANUAL:
      case SET_PAD_DRILL_OUT_DELAY_MANUAL:
      case SET_PAD_FACILITIES_DELAY_MANUAL:
      case SET_PAD_CONSTRUCTION_START:
      case SET_PAD_CONSTRUCTION_END:
      case SET_PAD_DRILL_START:
      case SET_PAD_DRILL_END:
      case SET_PAD_FRAC_START:
      case SET_PAD_FRAC_END:
      case SET_PAD_DRILL_OUT_START:
      case SET_PAD_DRILL_OUT_END:
      case SET_PAD_FACILITIES_START:
      case SET_PAD_FACILITIES_END:
      case SET_PAD_TIL:
      case SET_PAD_FIRST_FLOW:
      case SET_PAD_CONSTRUCTION_START_DEFAULT:
      case SET_PAD_DRILL_START_DEFAULT:
      case SET_PAD_FRAC_START_DEFAULT:
      case SET_PAD_DRILL_OUT_START_DEFAULT:
      case SET_PAD_FACILITIES_START_DEFAULT:
      case SET_PAD_CONSTRUCTION_START_MANUAL:
      case SET_PAD_DRILL_START_MANUAL:
      case SET_PAD_FRAC_START_MANUAL:
      case SET_PAD_DRILL_OUT_START_MANUAL:
      case SET_PAD_FACILITIES_START_MANUAL:
      case SET_PAD_CONSTRUCTION_COST:
      case SET_PAD_VERT_DRILL_COST:
      case SET_PAD_HORZ_DRILL_COST:
      case SET_PAD_DRILL_REHAB_COST:
      case SET_PAD_FRAC_COST:
      case SET_PAD_COMPLETIONS_REHAB_COST:
      case SET_PAD_WATER_TRANSFER_COST:
      case SET_PAD_DRILL_OUT_COST:
      case SET_PAD_FACILITIES_COST:
      case SET_PAD_FLOWBACK_COST:
      case SET_PAD_CREW:
      case SET_PAD_PREDECESSOR:
      case SET_PAD_SUCCESSOR:
      case SET_BATCH_DRILL_FLAG:
      case SET_PAD_IS_SCHEDULED:
      case SET_WELL_COUNT:
        newState = {
          ...newState,
          [action.payload.padID]: pad(newState[action.payload.padID], action)
        }
        break
    }
  }
  return newState
}

const pad = (state: Pad, action: PadActionTypes): Pad => {
  switch (action.type) {
    // measured data
    // case SET_PAD_FRAC_STAGES:
    //   return {
    //     ...state,
    //     fracStages: payload.fracStages
    //   }
    case SET_PAD_NAME:
      return {
        ...state,
        padName: action.payload.padName
      }
    case SET_PAD_WORKING_INTEREST:
      return {
        ...state,
        workingInterest: action.payload.workingInterest
      }
    // durations
    case SET_PAD_CONSTRUCTION_DURATION:
      return {
        ...state,
        constructionDuration: action.payload.duration
      }
    case SET_PAD_DRILL_DURATION:
      return {
        ...state,
        drillDuration: action.payload.duration
      }
    case SET_PAD_FRAC_DURATION:
      return {
        ...state,
        fracDuration: action.payload.duration
      }
    case SET_PAD_DRILL_OUT_DURATION:
      return {
        ...state,
        drillOutDuration: action.payload.duration
      }
    case SET_PAD_FACILITIES_DURATION:
      return {
        ...state,
        facilitiesDuration: action.payload.duration
      }
    case SET_PAD_CONSTRUCTION_DURATION_DEFAULT:
      return {
        ...state,
        constructionDurationDefault: action.payload.duration
      }
    case SET_PAD_DRILL_DURATION_DEFAULT:
      return {
        ...state,
        drillDurationDefault: action.payload.duration
      }
    case SET_PAD_FRAC_DURATION_DEFAULT:
      return {
        ...state,
        fracDurationDefault: action.payload.duration
      }
    case SET_PAD_DRILL_OUT_DURATION_DEFAULT:
      return {
        ...state,
        drillOutDurationDefault: action.payload.duration
      }
    case SET_PAD_FACILITIES_DURATION_DEFAULT:
      return {
        ...state,
        facilitiesDurationDefault: action.payload.duration
      }
    case SET_PAD_CONSTRUCTION_DURATION_MANUAL:
    case SET_PAD_DRILL_DURATION_MANUAL:
    case SET_PAD_FRAC_DURATION_MANUAL:
    case SET_PAD_DRILL_OUT_DURATION_MANUAL:
    case SET_PAD_FACILITIES_DURATION_MANUAL:
      return {
        ...state,
        manualDurations: manualDurations(state.manualDurations, action)
      }
    case SET_PAD_DRILL_DELAY_MANUAL:
    case SET_PAD_FRAC_DELAY_MANUAL:
    case SET_PAD_DRILL_OUT_DELAY_MANUAL:
    case SET_PAD_FACILITIES_DELAY_MANUAL:
      return {
        ...state,
        manualDelays: manualDelays(state.manualDelays, action)
      }
    // dates
    case SET_PAD_CONSTRUCTION_START:
      return {
        ...state,
        constructionStart: action.payload.date
      }
    case SET_PAD_CONSTRUCTION_END:
      return {
        ...state,
        constructionEnd: action.payload.date
      }
    case SET_PAD_DRILL_START:
      return {
        ...state,
        drillStart: action.payload.date
      }
    case SET_PAD_DRILL_END:
      return {
        ...state,
        drillEnd: action.payload.date
      }
    case SET_PAD_FRAC_START:
      return {
        ...state,
        fracStart: action.payload.date
      }
    case SET_PAD_FRAC_END:
      return {
        ...state,
        fracEnd: action.payload.date
      }
    case SET_PAD_DRILL_OUT_START:
      return {
        ...state,
        drillOutStart: action.payload.date
      }
    case SET_PAD_DRILL_OUT_END:
      return {
        ...state,
        drillOutEnd: action.payload.date
      }
    case SET_PAD_FACILITIES_START:
      return {
        ...state,
        facilitiesStart: action.payload.date
      }
    case SET_PAD_FACILITIES_END:
      return {
        ...state,
        facilitiesEnd: action.payload.date
      }
    case SET_PAD_TIL:
      return {
        ...state,
        til: action.payload.date
      }
    case SET_PAD_FIRST_FLOW:
      return {
        ...state,
        firstFlow: action.payload.date
      }
    // default dates
    case SET_PAD_CONSTRUCTION_START_DEFAULT:
      return {
        ...state,
        constructionStartDefault: action.payload.date
      }
    case SET_PAD_DRILL_START_DEFAULT:
      return {
        ...state,
        drillStartDefault: action.payload.date
      }
    case SET_PAD_FRAC_START_DEFAULT:
      return {
        ...state,
        fracStartDefault: action.payload.date
      }
    case SET_PAD_DRILL_OUT_START_DEFAULT:
      return {
        ...state,
        drillOutStartDefault: action.payload.date
      }
    case SET_PAD_FACILITIES_START_DEFAULT:
      return {
        ...state,
        facilitiesStartDefault: action.payload.date
      }
    // manual dates
    case SET_PAD_CONSTRUCTION_START_MANUAL:
    case SET_PAD_DRILL_START_MANUAL:
    case SET_PAD_FRAC_START_MANUAL:
    case SET_PAD_DRILL_OUT_START_MANUAL:
    case SET_PAD_FACILITIES_START_MANUAL:
      return {
        ...state,
        manualDates: manualDates(state.manualDates, action)
      }
    // costs
    case SET_PAD_CONSTRUCTION_COST:
      return {
        ...state,
        constructionCost: action.payload.cost
      }
    case SET_PAD_VERT_DRILL_COST:
      return {
        ...state,
        vertDrillCost: action.payload.cost
      }
    case SET_PAD_HORZ_DRILL_COST:
      return {
        ...state,
        horzDrillCost: action.payload.cost
      }
    case SET_PAD_DRILL_REHAB_COST:
      return {
        ...state,
        drillRehabCost: action.payload.cost
      }
    case SET_PAD_FRAC_COST:
      return {
        ...state,
        fracCost: action.payload.cost
      }
    case SET_PAD_COMPLETIONS_REHAB_COST:
      return {
        ...state,
        completionsRehabCost: action.payload.cost
      }
    case SET_PAD_WATER_TRANSFER_COST:
      return {
        ...state,
        waterTransferCost: action.payload.cost
      }
    case SET_PAD_DRILL_OUT_COST:
      return {
        ...state,
        drillOutCost: action.payload.cost
      }
    case SET_PAD_FACILITIES_COST:
      return {
        ...state,
        facilitiesCost: action.payload.cost
      }
    case SET_PAD_FLOWBACK_COST:
      return {
        ...state,
        flowbackCost: action.payload.cost
      }
    // crews
    case SET_PAD_CREW:
      return {
        ...state,
        crews: crews(state.crews, action)
      }
    // predecessors
    case SET_PAD_PREDECESSOR:
      return {
        ...state,
        predecessors: predecessors(state.predecessors, action)
      }
    // successors
    case SET_PAD_SUCCESSOR:
      return {
        ...state,
        successors: successors(state.successors, action)
      }
    case SET_BATCH_DRILL_FLAG:
      return {
        ...state,
        batchDrill: action.payload.batchDrillFlag
      }
    case SET_PAD_IS_SCHEDULED:
      return {
        ...state,
        isScheduled: action.payload.isScheduled
      }
    case SET_WELL_COUNT:
      return {
        ...state,
        wellCount: action.payload.wellCount
      }
    default: return state
  }
}

const crews = (state: PartialRecord<ScheduleType, number>, action: PadActionTypes): PartialRecord<ScheduleType, number> => {
  switch (action.type) {
    case SET_PAD_CREW:
      if (isNaN(action.payload.crewID)) {
        let { [action.payload.scheduleType]: deletedCrew, ...newState } = state
        return newState
      } else {
        return {
          ...state,
          [action.payload.scheduleType]: action.payload.crewID
        }
      }
    default: return state
  }
}

const predecessors = (state: PartialRecord<ScheduleType, number>, action: PadActionTypes): PartialRecord<ScheduleType, number> => {
  switch (action.type) {
    case SET_PAD_PREDECESSOR:
      if (isNaN(action.payload.predecessorPadID)) {
        let { [action.payload.scheduleType]: deletedPadPredecessor, ...newState } = state
        return newState
      } else {
        return {
          ...state,
          [action.payload.scheduleType]: action.payload.predecessorPadID
        }
      }
    default: return state
  }
}

const successors = (state: PartialRecord<ScheduleType, number>, action: PadActionTypes): PartialRecord<ScheduleType, number> => {
  switch (action.type) {
    case SET_PAD_SUCCESSOR:
      if (isNaN(action.payload.successorPadID)) {
        let { [action.payload.scheduleType]: deletedPadSuccessor, ...newState } = state
        return newState
      } else {
        return {
          ...state,
          [action.payload.scheduleType]: action.payload.successorPadID
        }
      }
    default: return state
  }
}

const manualDates = (state: PartialRecord<ScheduleType, string>, action: PadActionTypes): PartialRecord<ScheduleType, string> => {
  let scheduleType: ScheduleType
  switch (action.type) {
    case SET_PAD_CONSTRUCTION_START_MANUAL: scheduleType = ScheduleType.Construction; break
    case SET_PAD_DRILL_START_MANUAL: scheduleType = ScheduleType.Drill; break
    case SET_PAD_FRAC_START_MANUAL: scheduleType = ScheduleType.Frac; break
    case SET_PAD_DRILL_OUT_START_MANUAL: scheduleType = ScheduleType.DrillOut; break
    case SET_PAD_FACILITIES_START_MANUAL: scheduleType = ScheduleType.Facilities; break
    default: return state
  }

  if (action.payload.date) {
    return {
      ...state,
      [scheduleType]: action.payload.date
    }
  } else {
    let { [scheduleType]: deletedDate, ...newDateState } = state
    return newDateState
  }
}

const manualDurations = (state: PartialRecord<ScheduleType, number>, action: PadActionTypes): PartialRecord<ScheduleType, number> => {
  let scheduleType: ScheduleType
  switch (action.type) {
    case SET_PAD_CONSTRUCTION_DURATION_MANUAL: scheduleType = ScheduleType.Construction; break
    case SET_PAD_DRILL_DURATION_MANUAL: scheduleType = ScheduleType.Drill; break
    case SET_PAD_FRAC_DURATION_MANUAL: scheduleType = ScheduleType.Frac; break
    case SET_PAD_DRILL_OUT_DURATION_MANUAL: scheduleType = ScheduleType.DrillOut; break
    case SET_PAD_FACILITIES_DURATION_MANUAL: scheduleType = ScheduleType.Facilities; break
    default: return state
  }

  if (isNaN(action.payload.duration)) {
    let { [scheduleType]: deletedDuration, ...newDurationState } = state
    return newDurationState
  } else {
    return {
      ...state,
      [scheduleType]: action.payload.duration
    }
  }
}
const manualDelays = (state: PartialRecord<ScheduleType, number>, action: PadActionTypes): PartialRecord<ScheduleType, number> => {
  let scheduleType: ScheduleType
  switch(action.type) {
    case SET_PAD_DRILL_DELAY_MANUAL: scheduleType = ScheduleType.Drill; break
    case SET_PAD_FRAC_DELAY_MANUAL: scheduleType = ScheduleType.Frac; break
    case SET_PAD_DRILL_OUT_DELAY_MANUAL: scheduleType = ScheduleType.DrillOut; break
    case SET_PAD_FACILITIES_DELAY_MANUAL: scheduleType = ScheduleType.Facilities; break
    default: return state
  }

  if (isNaN(action.payload.delay)) {
    let { [scheduleType]: deletedDelay, ...newDelayState } = state
    return newDelayState
  } else {
    return {
      ...state,
      [scheduleType]: action.payload.delay
    }
  }
}