import { Pads, ScheduleType } from '../../types'

/*********************
 * Other
 ********************/
type OtherActionTypes = SetPadsAction | CreateTempPad | DeleteTempPad | SplitPadAction | UnsplitPadAction | SetPadNameAction | SetPadCrewAction | SetPadPredecessorAction | SetPadSuccessorAction | SetBatchDrillFlagAction | SetPadIsScheduledAction | SetWellCountAction | SetPadWorkingInterestAction

export const SET_PADS = 'SET_PADS'
interface SetPadsAction {
  type: typeof SET_PADS
  payload: Pads
}
export const CREATE_TEMP_PAD = 'CREATE_TEMP_PAD'
interface CreateTempPad {
  type: typeof CREATE_TEMP_PAD
  payload: {
    padID: number
    padName: string
  }
}
export const DELETE_TEMP_PAD = 'DELETE_TEMP_PAD'
interface DeleteTempPad {
  type: typeof DELETE_TEMP_PAD
  payload: number
}
export const SPLIT_PAD = 'SPLIT_PAD'
interface SplitPadAction {
  type: typeof SPLIT_PAD
  payload: {
    padID: number
    newPadID: number
  }
}
export const UNSPLIT_PAD = 'UNSPLIT_PAD'
interface UnsplitPadAction {
  type: typeof UNSPLIT_PAD
  payload: number
}

export const SET_PAD_NAME = 'SET_PAD_NAME'
interface SetPadNameAction {
  type: typeof SET_PAD_NAME
  payload: {
    padID: number
    padName: string
  }
}

export const SET_PAD_CREW = 'SET_PAD_CREW'
interface SetPadCrewAction {
  type: typeof SET_PAD_CREW
  payload: {
    padID: number
    scheduleType: ScheduleType
    crewID: number
  }
}

export const SET_PAD_PREDECESSOR = 'SET_PAD_PREDECESSOR'
interface SetPadPredecessorAction {
  type: typeof SET_PAD_PREDECESSOR
  payload: {
    padID: number
    scheduleType: ScheduleType
    predecessorPadID: number
  }
}
export const SET_PAD_SUCCESSOR = 'SET_PAD_SUCCESSOR'
interface SetPadSuccessorAction {
  type: typeof SET_PAD_SUCCESSOR
  payload: {
    padID: number
    scheduleType: ScheduleType
    successorPadID: number
  }
}

export const SET_PAD_IS_SCHEDULED = 'SET_PAD_IS_SCHEDULED'
interface SetPadIsScheduledAction {
  type: typeof SET_PAD_IS_SCHEDULED
  payload: {
    padID: number
    isScheduled: boolean
  }
}

export const SET_BATCH_DRILL_FLAG = 'SET_BATCH_DRILL_FLAG'
interface SetBatchDrillFlagAction {
  type: typeof SET_BATCH_DRILL_FLAG
  payload: {
    padID: number
    batchDrillFlag: boolean
  }
}

export const SET_WELL_COUNT = 'SET_WELL_COUNT'
interface SetWellCountAction {
  type: typeof SET_WELL_COUNT
  payload: {
    padID: number
    wellCount: number
  }
}

export const SET_PAD_WORKING_INTEREST = 'SET_PAD_WORKING_INTEREST'
interface SetPadWorkingInterestAction {
  type: typeof SET_PAD_WORKING_INTEREST
  payload: {
    padID: number
    workingInterest: number
  }
}



/*********************
 * Dates
 ********************/
type DateActionTypes = SetPadConstructionStartAction | SetPadConstructionEndAction | SetPadDrillStartAction | SetPadDrillEndAction | SetPadFracStartAction | SetPadFracEndAction | SetPadDrillOutStartAction | SetPadDrillOutEndAction | SetPadFacilitiesStartAction | SetPadFacilitiesEndAction | SetPadTILAction | SetPadFirstFlowAction

export const SET_PAD_CONSTRUCTION_START = 'SET_PAD_CONSTRUCTION_START'
interface SetPadConstructionStartAction {
  type: typeof SET_PAD_CONSTRUCTION_START
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_CONSTRUCTION_END = 'SET_PAD_CONSTRUCTION_END'
interface SetPadConstructionEndAction {
  type: typeof SET_PAD_CONSTRUCTION_END
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_DRILL_START = 'SET_PAD_DRILL_START'
interface SetPadDrillStartAction {
  type: typeof SET_PAD_DRILL_START
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_DRILL_END = 'SET_PAD_DRILL_END'
interface SetPadDrillEndAction {
  type: typeof SET_PAD_DRILL_END
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_FRAC_START = 'SET_PAD_FRAC_START'
interface SetPadFracStartAction {
  type: typeof SET_PAD_FRAC_START
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_FRAC_END = 'SET_PAD_FRAC_END'
interface SetPadFracEndAction {
  type: typeof SET_PAD_FRAC_END
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_DRILL_OUT_START = 'SET_PAD_DRILL_OUT_START'
interface SetPadDrillOutStartAction {
  type: typeof SET_PAD_DRILL_OUT_START
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_DRILL_OUT_END = 'SET_PAD_DRILL_OUT_END'
interface SetPadDrillOutEndAction {
  type: typeof SET_PAD_DRILL_OUT_END
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_FACILITIES_START = 'SET_PAD_FACILITIES_START'
interface SetPadFacilitiesStartAction {
  type: typeof SET_PAD_FACILITIES_START
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_FACILITIES_END = 'SET_PAD_FACILITIES_END'
interface SetPadFacilitiesEndAction {
  type: typeof SET_PAD_FACILITIES_END
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_TIL = 'SET_PAD_TIL'
interface SetPadTILAction {
  type: typeof SET_PAD_TIL
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_FIRST_FLOW = 'SET_PAD_FIRST_FLOW'
interface SetPadFirstFlowAction {
  type: typeof SET_PAD_FIRST_FLOW
  payload: {
    padID: number
    date: string
  }
}

/*********************
 * Default Dates
 ********************/
type DefaultDateActionTypes = SetPadConstructionStartDefaultAction | SetPadDrillStartDefaultAction | SetPadFracStartDefaultAction | SetPadDrillOutStartDefaultAction | SetPadFacilitiesStartDefaultAction
export const SET_PAD_CONSTRUCTION_START_DEFAULT = 'SET_PAD_CONSTRUCTION_START_DEFAULT'
interface SetPadConstructionStartDefaultAction {
  type: typeof SET_PAD_CONSTRUCTION_START_DEFAULT
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_DRILL_START_DEFAULT = 'SET_PAD_DRILL_START_DEFAULT'
interface SetPadDrillStartDefaultAction {
  type: typeof SET_PAD_DRILL_START_DEFAULT
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_FRAC_START_DEFAULT = 'SET_PAD_FRAC_START_DEFAULT'
interface SetPadFracStartDefaultAction {
  type: typeof SET_PAD_FRAC_START_DEFAULT
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_DRILL_OUT_START_DEFAULT = 'SET_PAD_DRILL_OUT_START_DEFAULT'
interface SetPadDrillOutStartDefaultAction {
  type: typeof SET_PAD_DRILL_OUT_START_DEFAULT
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_FACILITIES_START_DEFAULT = 'SET_PAD_FACILITIES_START_DEFAULT'
interface SetPadFacilitiesStartDefaultAction {
  type: typeof SET_PAD_FACILITIES_START_DEFAULT
  payload: {
    padID: number
    date: string
  }
}

/*********************
 * Manual Dates
 ********************/
type ManualDateActionTypes = SetPadConstructionStartManualAction | SetPadDrillStartManualAction | SetPadFracStartManualAction | SetPadDrillOutStartManualAction | SetPadFacilitiesStartManualAction

export const SET_PAD_CONSTRUCTION_START_MANUAL = 'SET_PAD_CONSTRUCTION_START_MANUAL'
interface SetPadConstructionStartManualAction {
  type: typeof SET_PAD_CONSTRUCTION_START_MANUAL
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_DRILL_START_MANUAL = 'SET_PAD_DRILL_START_MANUAL'
interface SetPadDrillStartManualAction {
  type: typeof SET_PAD_DRILL_START_MANUAL
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_FRAC_START_MANUAL = 'SET_PAD_FRAC_START_MANUAL'
interface SetPadFracStartManualAction {
  type: typeof SET_PAD_FRAC_START_MANUAL
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_DRILL_OUT_START_MANUAL = 'SET_PAD_DRILL_OUT_START_MANUAL'
interface SetPadDrillOutStartManualAction {
  type: typeof SET_PAD_DRILL_OUT_START_MANUAL
  payload: {
    padID: number
    date: string
  }
}
export const SET_PAD_FACILITIES_START_MANUAL = 'SET_PAD_FACILITIES_START_MANUAL'
interface SetPadFacilitiesStartManualAction {
  type: typeof SET_PAD_FACILITIES_START_MANUAL
  payload: {
    padID: number
    date: string
  }
}

/*********************
 * Costs
 ********************/
type CostActionTypes = SetPadConstructionCostAction | SetPadVertDrillCostAction | SetPadHorzDrillCostAction | SetPadDrillRehabCostAction | SetPadFracCostAction | SetPadCompletionsRehabCostAction | SetPadWaterTransferCostAction | SetPadDrillOutCostAction | SetPadFacilitiesCostAction | SetPadFlowbackCostAction

export const SET_PAD_CONSTRUCTION_COST = 'SET_PAD_CONSTRUCTION_COST'
interface SetPadConstructionCostAction {
  type: typeof SET_PAD_CONSTRUCTION_COST
  payload: {
    padID: number
    cost: number
  }
}
export const SET_PAD_VERT_DRILL_COST = 'SET_PAD_VERT_DRILL_COST'
interface SetPadVertDrillCostAction {
  type: typeof SET_PAD_VERT_DRILL_COST
  payload: {
    padID: number
    cost: number
  }
}
export const SET_PAD_HORZ_DRILL_COST = 'SET_PAD_HORZ_DRILL_COST'
interface SetPadHorzDrillCostAction {
  type: typeof SET_PAD_HORZ_DRILL_COST
  payload: {
    padID: number
    cost: number
  }
}
export const SET_PAD_DRILL_REHAB_COST = 'SET_PAD_DRILL_REHAB_COST'
interface SetPadDrillRehabCostAction {
  type: typeof SET_PAD_DRILL_REHAB_COST
  payload: {
    padID: number
    cost: number
  }
}
export const SET_PAD_FRAC_COST = 'SET_PAD_FRAC_COST'
interface SetPadFracCostAction {
  type: typeof SET_PAD_FRAC_COST
  payload: {
    padID: number
    cost: number
  }
}
export const SET_PAD_COMPLETIONS_REHAB_COST = 'SET_PAD_COMPLETIONS_REHAB_COST'
interface SetPadCompletionsRehabCostAction {
  type: typeof SET_PAD_COMPLETIONS_REHAB_COST
  payload: {
    padID: number
    cost: number
  }
}
export const SET_PAD_WATER_TRANSFER_COST = 'SET_PAD_WATER_TRANSFER_COST'
interface SetPadWaterTransferCostAction {
  type: typeof SET_PAD_WATER_TRANSFER_COST
  payload: {
    padID: number
    cost: number
  }
}
export const SET_PAD_DRILL_OUT_COST = 'SET_PAD_DRILL_OUT_COST'
interface SetPadDrillOutCostAction {
  type: typeof SET_PAD_DRILL_OUT_COST
  payload: {
    padID: number
    cost: number
  }
}
export const SET_PAD_FACILITIES_COST = 'SET_PAD_FACILITIES_COST'
interface SetPadFacilitiesCostAction {
  type: typeof SET_PAD_FACILITIES_COST
  payload: {
    padID: number
    cost: number
  }
}
export const SET_PAD_FLOWBACK_COST = 'SET_PAD_FLOWBACK_COST'
interface SetPadFlowbackCostAction {
  type: typeof SET_PAD_FLOWBACK_COST
  payload: {
    padID: number
    cost: number
  }
}

/*********************
 * Durations
 ********************/
type DurationActionTypes = SetPadConstructionDurationAction | SetPadDrillDurationAction | SetPadFracDurationAction | SetPadDrillOutDurationAction | SetPadFacilitiesDurationAction

export const SET_PAD_CONSTRUCTION_DURATION = 'SET_PAD_CONSTRUCTION_DURATION'
interface SetPadConstructionDurationAction {
  type: typeof SET_PAD_CONSTRUCTION_DURATION
  payload: {
    padID: number
    duration: number
  }
}
export const SET_PAD_DRILL_DURATION = 'SET_PAD_DRILL_DURATION'
interface SetPadDrillDurationAction {
  type: typeof SET_PAD_DRILL_DURATION
  payload: {
    padID: number
    duration: number
  }
}
export const SET_PAD_FRAC_DURATION = 'SET_PAD_FRAC_DURATION'
interface SetPadFracDurationAction {
  type: typeof SET_PAD_FRAC_DURATION
  payload: {
    padID: number
    duration: number
  }
}
export const SET_PAD_DRILL_OUT_DURATION = 'SET_PAD_DRILL_OUT_DURATION'
interface SetPadDrillOutDurationAction {
  type: typeof SET_PAD_DRILL_OUT_DURATION
  payload: {
    padID: number
    duration: number
  }
}
export const SET_PAD_FACILITIES_DURATION = 'SET_PAD_FACILITIES_DURATION'
interface SetPadFacilitiesDurationAction {
  type: typeof SET_PAD_FACILITIES_DURATION
  payload: {
    padID: number
    duration: number
  }
}

/*********************
 * Default Durations
 ********************/
type DefaultDurationActionTypes = SetPadConstructionDurationDefaultAction | SetPadDrillDurationDefaultAction | SetPadFracDurationDefaultAction | SetPadDrillOutDurationDefaultAction | SetPadFacilitiesDurationDefaultAction

export const SET_PAD_CONSTRUCTION_DURATION_DEFAULT = 'SET_PAD_CONSTRUCTION_DURATION_DEFAULT'
interface SetPadConstructionDurationDefaultAction {
  type: typeof SET_PAD_CONSTRUCTION_DURATION_DEFAULT
  payload: {
    padID: number
    duration: number
  }
}
export const SET_PAD_DRILL_DURATION_DEFAULT = 'SET_PAD_DRILL_DURATION_DEFAULT'
interface SetPadDrillDurationDefaultAction {
  type: typeof SET_PAD_DRILL_DURATION_DEFAULT
  payload: {
    padID: number
    duration: number
  }
}
export const SET_PAD_FRAC_DURATION_DEFAULT = 'SET_PAD_FRAC_DURATION_DEFAULT'
interface SetPadFracDurationDefaultAction {
  type: typeof SET_PAD_FRAC_DURATION_DEFAULT
  payload: {
    padID: number
    duration: number
  }
}
export const SET_PAD_DRILL_OUT_DURATION_DEFAULT = 'SET_PAD_DRILL_OUT_DURATION_DEFAULT'
interface SetPadDrillOutDurationDefaultAction {
  type: typeof SET_PAD_DRILL_OUT_DURATION_DEFAULT
  payload: {
    padID: number
    duration: number
  }
}
export const SET_PAD_FACILITIES_DURATION_DEFAULT = 'SET_PAD_FACILITIES_DURATION_DEFAULT'
interface SetPadFacilitiesDurationDefaultAction {
  type: typeof SET_PAD_FACILITIES_DURATION_DEFAULT
  payload: {
    padID: number
    duration: number
  }
}

/*********************
 * Manual Durations
 ********************/
type ManualDurationActionTypes = SetPadConstructionDurationManualAction | SetPadDrillDurationManualAction | SetPadFracDurationManualAction | SetPadDrillOutDurationManualAction | SetPadFacilitiesDurationManualAction

export const SET_PAD_CONSTRUCTION_DURATION_MANUAL = 'SET_PAD_CONSTRUCTION_DURATION_MANUAL'
interface SetPadConstructionDurationManualAction {
  type: typeof SET_PAD_CONSTRUCTION_DURATION_MANUAL
  payload: {
    padID: number
    duration: number
  }
}
export const SET_PAD_DRILL_DURATION_MANUAL = 'SET_PAD_DRILL_DURATION_MANUAL'
interface SetPadDrillDurationManualAction {
  type: typeof SET_PAD_DRILL_DURATION_MANUAL
  payload: {
    padID: number
    duration: number
  }
}
export const SET_PAD_FRAC_DURATION_MANUAL = 'SET_PAD_FRAC_DURATION_MANUAL'
interface SetPadFracDurationManualAction {
  type: typeof SET_PAD_FRAC_DURATION_MANUAL
  payload: {
    padID: number
    duration: number
  }
}
export const SET_PAD_DRILL_OUT_DURATION_MANUAL = 'SET_PAD_DRILL_OUT_DURATION_MANUAL'
interface SetPadDrillOutDurationManualAction {
  type: typeof SET_PAD_DRILL_OUT_DURATION_MANUAL
  payload: {
    padID: number
    duration: number
  }
}
export const SET_PAD_FACILITIES_DURATION_MANUAL = 'SET_PAD_FACILITIES_DURATION_MANUAL'
interface SetPadFacilitiesDurationManualAction {
  type: typeof SET_PAD_FACILITIES_DURATION_MANUAL
  payload: {
    padID: number
    duration: number
  }
}

/*********************
 * Delays
 ********************/
type DelayActionTypes = SetPadDrillDelayManualAction | SetPadFracDelayManualAction | SetPadDrillOutDelayManualAction | SetPadFacilitiesDelayManualAction
export const SET_PAD_DRILL_DELAY_MANUAL = 'SET_PAD_DRILL_DELAY_MANUAL'
interface SetPadDrillDelayManualAction {
  type: typeof SET_PAD_DRILL_DELAY_MANUAL
  payload: {
    padID: number
    delay: number
  }
}
export const SET_PAD_FRAC_DELAY_MANUAL = 'SET_PAD_FRAC_DELAY_MANUAL'
interface SetPadFracDelayManualAction {
  type: typeof SET_PAD_FRAC_DELAY_MANUAL
  payload: {
    padID: number
    delay: number
  }
}
export const SET_PAD_DRILL_OUT_DELAY_MANUAL = 'SET_PAD_DRILL_OUT_DELAY_MANUAL'
interface SetPadDrillOutDelayManualAction {
  type: typeof SET_PAD_DRILL_OUT_DELAY_MANUAL
  payload: {
    padID: number
    delay: number
  }
}
export const SET_PAD_FACILITIES_DELAY_MANUAL = 'SET_PAD_FACILITIES_DELAY_MANUAL'
interface SetPadFacilitiesDelayManualAction {
  type: typeof SET_PAD_FACILITIES_DELAY_MANUAL
  payload: {
    padID: number
    delay: number
  }
}

export type PadActionTypes = OtherActionTypes | DateActionTypes | DefaultDateActionTypes | ManualDateActionTypes | CostActionTypes | DurationActionTypes | DefaultDurationActionTypes | ManualDurationActionTypes | DelayActionTypes