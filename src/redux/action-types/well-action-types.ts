import { Wells } from '../../types'

/*********************
 * Other
 ********************/
type OtherActionTypes = SetWellsAction | SetWellPadIDAction | SetWellNameAction | SetWellSurfaceLocation | SetWellPredecessorAction | SetWellAvgSpacingAction | SetWellFracStagesAction | SetWellStagesPerDayAction | SetWellFracDesignAction

export const SET_WELLS = 'SET_WELLS'
interface SetWellsAction {
  type: typeof SET_WELLS
  payload: Wells
}

export const SET_WELL_PADID = 'SET_WELL_PADID'
interface SetWellPadIDAction {
  type: typeof SET_WELL_PADID
  payload: {
    wellID: number
    padID: number
  }
}

export const SET_WELL_NAME = 'SET_WELL_NAME'
interface SetWellNameAction {
  type: typeof SET_WELL_NAME
  payload: {
    wellID: number
    wellName: string
  }
}

export const SET_WELL_SURFACE_LOCATION = 'SET_WELL_SURFACE_LOCATION'
interface SetWellSurfaceLocation {
  type: typeof SET_WELL_SURFACE_LOCATION
  payload: {
    wellID: number
    surfaceLocation: number
  }
}

export const SET_WELL_PREDECESSOR = 'SET_WELL_PREDECESSOR'
interface SetWellPredecessorAction {
  type: typeof SET_WELL_PREDECESSOR
  payload: {
    wellID: number
    predecessorWellID: number
  }
}

export const SET_WELL_AVG_SPACING = 'SET_WELL_AVG_SPACING'
interface SetWellAvgSpacingAction {
  type: typeof SET_WELL_AVG_SPACING
  payload: {
    wellID: number
    avgSpacing: number
  }
}
export const SET_WELL_FRAC_STAGES = 'SET_WELL_FRAC_STAGES'
interface SetWellFracStagesAction {
  type: typeof SET_WELL_FRAC_STAGES
  payload: {
    wellID: number
    fracStages: number
  }
}
export const SET_WELL_STAGES_PER_DAY = 'SET_WELL_STAGES_PER_DAY'
interface SetWellStagesPerDayAction {
  type: typeof SET_WELL_STAGES_PER_DAY
  payload: {
    wellID: number
    stagesPerDay: number
  }
}
export const SET_WELL_FRAC_DESIGN = 'SET_WELL_FRAC_DESIGN'
interface SetWellFracDesignAction {
  type: typeof SET_WELL_FRAC_DESIGN
  payload: {
    wellID: number
    fracDesign: string
  }
}


type SourceDataActionTypes = SetGPWellNoAction | SetWellWIAction | SetLateralLengthAction | SetTVDAction | SetTMDAction | SetSpacingLeftAction | SetSpacingRightAction
  | SetFormationAction | SetPhaseWindowAction | SetDistrictTownshipAction | SetLateralSiteAction | SetUnitIDAction | SetUnitAction

export const SET_GP_WELL_NO = 'SET_GP_WELL_NO'
interface SetGPWellNoAction {
  type: typeof SET_GP_WELL_NO
  payload: {
    wellID: number
    gpWellNo: number
  }
}
export const SET_WELL_WI = 'SET_WELL_WI'
interface SetWellWIAction {
  type: typeof SET_WELL_WI
  payload: {
    wellID: number
    workingInterest: number
  }
}
export const SET_LATERAL_LENGTH = 'SET_LATERAL_LENGTH'
interface SetLateralLengthAction {
  type: typeof SET_LATERAL_LENGTH
  payload: {
    wellID: number
    lateralLength: number
  }
}
export const SET_TVD = 'SET_TVD'
interface SetTVDAction {
  type: typeof SET_TVD
  payload: {
    wellID: number
    tvd: number
  }
}
export const SET_TMD = 'SET_TMD'
interface SetTMDAction {
  type: typeof SET_TMD
  payload: {
    wellID: number
    tmd: number
  }
}
export const SET_SPACING_LEFT = 'SET_SPACING_LEFT'
interface SetSpacingLeftAction {
  type: typeof SET_SPACING_LEFT
  payload: {
    wellID: number
    spacingLeft: number
  }
}
export const SET_SPACING_RIGHT = 'SET_SPACING_RIGHT'
interface SetSpacingRightAction {
  type: typeof SET_SPACING_RIGHT
  payload: {
    wellID: number
    spacingRight: number
  }
}
export const SET_FORMATION = 'SET_FORMATION'
interface SetFormationAction {
  type: typeof SET_FORMATION
  payload: {
    wellID: number
    formation: string
  }
}
export const SET_PHASE_WINDOW = 'SET_PHASE_WINDOW'
interface SetPhaseWindowAction {
  type: typeof SET_PHASE_WINDOW
  payload: {
    wellID: number
    phaseWindow: string
  }
}
export const SET_DISTRICT_TOWNSHIP = 'SET_DISTRICT_TOWNSHIP'
interface SetDistrictTownshipAction {
  type: typeof SET_DISTRICT_TOWNSHIP
  payload: {
    wellID: number
    districtTownship: string
  }
}
export const SET_LATERAL_SITE = 'SET_LATERAL_SITE'
interface SetLateralSiteAction {
  type: typeof SET_LATERAL_SITE
  payload: {
    wellID: number
    lateralSite: string
  }
}
export const SET_UNIT_ID = 'SET_UNIT_ID'
interface SetUnitIDAction {
  type: typeof SET_UNIT_ID
  payload: {
    wellID: number
    unitID: number
  }
}
export const SET_UNIT = 'SET_UNIT'
interface SetUnitAction {
  type: typeof SET_UNIT
  payload: {
    wellID: number
    unit: string
  }
}

/*********************
 * Drill Orders
 ********************/
type DrillOrderActionTypes = SetWellVertDrillOrderDefaultAction | SetWellVertDrillOrderManualAction | SetWellVertDrillOrderAction | SetWellHorzDrillOrderDefaultAction | SetWellHorzDrillOrderManualAction | SetWellHorzDrillOrderAction
export const SET_WELL_VERT_DRILL_ORDER_DEFAULT = 'SET_WELL_VERT_DRILL_ORDER_DEFAULT'
interface SetWellVertDrillOrderDefaultAction {
  type: typeof SET_WELL_VERT_DRILL_ORDER_DEFAULT
  payload: {
    wellID: number
    drillOrder: number
  }
}
export const SET_WELL_VERT_DRILL_ORDER_MANUAL = 'SET_WELL_VERT_DRILL_ORDER_MANUAL'
interface SetWellVertDrillOrderManualAction {
  type: typeof SET_WELL_VERT_DRILL_ORDER_MANUAL
  payload: {
    wellID: number
    drillOrder: number
  }
}
export const SET_WELL_VERT_DRILL_ORDER = 'SET_WELL_VERT_DRILL_ORDER'
interface SetWellVertDrillOrderAction {
  type: typeof SET_WELL_VERT_DRILL_ORDER
  payload: {
    wellID: number
    drillOrder: number
  }
}
export const SET_WELL_HORZ_DRILL_ORDER_DEFAULT = 'SET_WELL_HORZ_DRILL_ORDER_DEFAULT'
interface SetWellHorzDrillOrderDefaultAction {
  type: typeof SET_WELL_HORZ_DRILL_ORDER_DEFAULT
  payload: {
    wellID: number
    drillOrder: number
  }
}
export const SET_WELL_HORZ_DRILL_ORDER_MANUAL = 'SET_WELL_HORZ_DRILL_ORDER_MANUAL'
interface SetWellHorzDrillOrderManualAction {
  type: typeof SET_WELL_HORZ_DRILL_ORDER_MANUAL
  payload: {
    wellID: number
    drillOrder: number
  }
}
export const SET_WELL_HORZ_DRILL_ORDER = 'SET_WELL_HORZ_DRILL_ORDER'
interface SetWellHorzDrillOrderAction {
  type: typeof SET_WELL_HORZ_DRILL_ORDER
  payload: {
    wellID: number
    drillOrder: number
  }
}

/*********************
 * Dates
 ********************/
type DateActionTypes = SetWellConstructionStartAction | SetWellConstructionEndAction | SetWellVertDrillStartAction | SetWellVertDrillEndAction | SetWellHorzDrillStartAction | SetWellHorzDrillEndAction
  | SetWellFracStartAction | SetWellFracEndAction | SetWellDrillOutStartAction | SetWellDrillOutEndAction | SetWellFacilitiesStartAction | SetWellFacilitiesEndAction | SetWellTILAction | SetWellFirstFlowAction
export const SET_WELL_CONSTRUCTION_START = 'SET_WELL_CONSTRUCTION_START'
interface SetWellConstructionStartAction {
  type: typeof SET_WELL_CONSTRUCTION_START
  payload: {
    wellID: number
    date: string
  }
}
export const SET_WELL_CONSTRUCTION_END = 'SET_WELL_CONSTRUCTION_END'
interface SetWellConstructionEndAction {
  type: typeof SET_WELL_CONSTRUCTION_END
  payload: {
    wellID: number
    date: string
  }
}
export const SET_WELL_VERT_DRILL_START = 'SET_WELL_VERT_DRILL_START'
interface SetWellVertDrillStartAction {
  type: typeof SET_WELL_VERT_DRILL_START
  payload: {
    wellID: number
    date: string
  }
}
export const SET_WELL_VERT_DRILL_END = 'SET_WELL_VERT_DRILL_END'
interface SetWellVertDrillEndAction {
  type: typeof SET_WELL_VERT_DRILL_END
  payload: {
    wellID: number
    date: string
  }
}
export const SET_WELL_HORZ_DRILL_START = 'SET_WELL_HORZ_DRILL_START'
interface SetWellHorzDrillStartAction {
  type: typeof SET_WELL_HORZ_DRILL_START
  payload: {
    wellID: number
    date: string
  }
}
export const SET_WELL_HORZ_DRILL_END = 'SET_WELL_HORZ_DRILL_END'
interface SetWellHorzDrillEndAction {
  type: typeof SET_WELL_HORZ_DRILL_END
  payload: {
    wellID: number
    date: string
  }
}
export const SET_WELL_FRAC_START = 'SET_WELL_FRAC_START'
interface SetWellFracStartAction {
  type: typeof SET_WELL_FRAC_START
  payload: {
    wellID: number
    date: string
  }
}
export const SET_WELL_FRAC_END = 'SET_WELL_FRAC_END'
interface SetWellFracEndAction {
  type: typeof SET_WELL_FRAC_END
  payload: {
    wellID: number
    date: string
  }
}
export const SET_WELL_DRILL_OUT_START = 'SET_WELL_DRILL_OUT_START'
interface SetWellDrillOutStartAction {
  type: typeof SET_WELL_DRILL_OUT_START
  payload: {
    wellID: number
    date: string
  }
}
export const SET_WELL_DRILL_OUT_END = 'SET_WELL_DRILL_OUT_END'
interface SetWellDrillOutEndAction {
  type: typeof SET_WELL_DRILL_OUT_END
  payload: {
    wellID: number
    date: string
  }
}
export const SET_WELL_FACILITIES_START = 'SET_WELL_FACILITIES_START'
interface SetWellFacilitiesStartAction {
  type: typeof SET_WELL_FACILITIES_START
  payload: {
    wellID: number
    date: string
  }
}
export const SET_WELL_FACILITIES_END = 'SET_WELL_FACILITIES_END'
interface SetWellFacilitiesEndAction {
  type: typeof SET_WELL_FACILITIES_END
  payload: {
    wellID: number
    date: string
  }
}
export const SET_WELL_TIL = 'SET_WELL_TIL'
interface SetWellTILAction {
  type: typeof SET_WELL_TIL
  payload: {
    wellID: number
    date: string
  }
}
export const SET_WELL_FIRST_FLOW = 'SET_WELL_FIRST_FLOW'
interface SetWellFirstFlowAction {
  type: typeof SET_WELL_FIRST_FLOW
  payload: {
    wellID: number
    date: string
  }
}

/*********************
 * Costs
 ********************/
type CostActionTypes = SetWellConstructionCostAction | SetWellVertDrillCostAction | SetWellHorzDrillCostAction | SetWellDrillRehabCostAction | SetWellFracCostAction | SetWellCompletionsRehabCostAction | SetWellWaterTransferCostAction | SetWellDrillOutCostAction | SetWellFacilitiesCostAction | SetWellFlowbackCostAction
export const SET_WELL_CONSTRUCTION_COST = 'SET_WELL_CONSTRUCTION_COST'
interface SetWellConstructionCostAction {
  type: typeof SET_WELL_CONSTRUCTION_COST
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_VERT_DRILL_COST = 'SET_WELL_VERT_DRILL_COST'
interface SetWellVertDrillCostAction {
  type: typeof SET_WELL_VERT_DRILL_COST
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_HORZ_DRILL_COST = 'SET_WELL_HORZ_DRILL_COST'
interface SetWellHorzDrillCostAction {
  type: typeof SET_WELL_HORZ_DRILL_COST
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_DRILL_REHAB_COST = 'SET_WELL_DRILL_REHAB_COST'
interface SetWellDrillRehabCostAction {
  type: typeof SET_WELL_DRILL_REHAB_COST
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_FRAC_COST = 'SET_WELL_FRAC_COST'
interface SetWellFracCostAction {
  type: typeof SET_WELL_FRAC_COST
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_COMPLETIONS_REHAB_COST = 'SET_WELL_COMPLETIONS_REHAB_COST'
interface SetWellCompletionsRehabCostAction {
  type: typeof SET_WELL_COMPLETIONS_REHAB_COST
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_WATER_TRANSFER_COST = 'SET_WELL_WATER_TRANSFER_COST'
interface SetWellWaterTransferCostAction {
  type: typeof SET_WELL_WATER_TRANSFER_COST
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_DRILL_OUT_COST = 'SET_WELL_DRILL_OUT_COST'
interface SetWellDrillOutCostAction {
  type: typeof SET_WELL_DRILL_OUT_COST
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_FACILITIES_COST = 'SET_WELL_FACILITIES_COST'
interface SetWellFacilitiesCostAction {
  type: typeof SET_WELL_FACILITIES_COST
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_FLOWBACK_COST = 'SET_WELL_FLOWBACK_COST'
interface SetWellFlowbackCostAction {
  type: typeof SET_WELL_FLOWBACK_COST
  payload: {
    wellID: number
    cost: number
  }
}

/*********************
 * Default Costs
 ********************/
type DefaultCostActionTypes = SetWellConstructionCostDefaultAction | SetWellVertDrillCostDefaultAction | SetWellHorzDrillCostDefaultAction | SetWellDrillRehabCostDefaultAction | SetWellFracCostDefaultAction | SetWellCompletionsRehabCostDefaultAction | SetWellWaterTransferCostDefaultAction | SetWellDrillOutCostDefaultAction | SetWellFacilitiesCostDefaultAction | SetWellFlowbackCostDefaultAction
export const SET_WELL_CONSTRUCTION_COST_DEFAULT = 'SET_WELL_CONSTRUCTION_COST_DEFAULT'
interface SetWellConstructionCostDefaultAction {
  type: typeof SET_WELL_CONSTRUCTION_COST_DEFAULT
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_VERT_DRILL_COST_DEFAULT = 'SET_WELL_VERT_DRILL_COST_DEFAULT'
interface SetWellVertDrillCostDefaultAction {
  type: typeof SET_WELL_VERT_DRILL_COST_DEFAULT
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_HORZ_DRILL_COST_DEFAULT = 'SET_WELL_HORZ_DRILL_COST_DEFAULT'
interface SetWellHorzDrillCostDefaultAction {
  type: typeof SET_WELL_HORZ_DRILL_COST_DEFAULT
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_DRILL_REHAB_COST_DEFAULT = 'SET_WELL_DRILL_REHAB_COST_DEFAULT'
interface SetWellDrillRehabCostDefaultAction {
  type: typeof SET_WELL_DRILL_REHAB_COST_DEFAULT
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_FRAC_COST_DEFAULT = 'SET_WELL_FRAC_COST_DEFAULT'
interface SetWellFracCostDefaultAction {
  type: typeof SET_WELL_FRAC_COST_DEFAULT
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_COMPLETIONS_REHAB_COST_DEFAULT = 'SET_WELL_COMPLETIONS_REHAB_COST_DEFAULT'
interface SetWellCompletionsRehabCostDefaultAction {
  type: typeof SET_WELL_COMPLETIONS_REHAB_COST_DEFAULT
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_WATER_TRANSFER_COST_DEFAULT = 'SET_WELL_WATER_TRANSFER_COST_DEFAULT'
interface SetWellWaterTransferCostDefaultAction {
  type: typeof SET_WELL_WATER_TRANSFER_COST_DEFAULT
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_DRILL_OUT_COST_DEFAULT = 'SET_WELL_DRILL_OUT_COST_DEFAULT'
interface SetWellDrillOutCostDefaultAction {
  type: typeof SET_WELL_DRILL_OUT_COST_DEFAULT
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_FACILITIES_COST_DEFAULT = 'SET_WELL_FACILITIES_COST_DEFAULT'
interface SetWellFacilitiesCostDefaultAction {
  type: typeof SET_WELL_FACILITIES_COST_DEFAULT
  payload: {
    wellID: number
    cost: number
  }
}
export const SET_WELL_FLOWBACK_COST_DEFAULT = 'SET_WELL_FLOWBACK_COST_DEFAULT'
interface SetWellFlowbackCostDefaultAction {
  type: typeof SET_WELL_FLOWBACK_COST_DEFAULT
  payload: {
    wellID: number
    cost: number
  }
}

/*********************
 * AFEs
 ********************/
type AFECostActionTypes = SetWellConstructionAFEAction | SetWellVertDrillAFEAction | SetWellHorzDrillAFEAction | SetWellDrillRehabAFEAction | SetWellFracAFEAction | SetWellCompletionsRehabAFEAction | SetWellWaterTransferAFEAction | SetWellDrillOutAFEAction | SetWellFacilitiesAFEAction | SetWellFlowbackAFEAction
export const SET_WELL_CONSTRUCTION_AFE = 'SET_WELL_CONSTRUCTION_AFE'
interface SetWellConstructionAFEAction {
  type: typeof SET_WELL_CONSTRUCTION_AFE
  payload: {
    wellID: number
    afe: number
  }
}
export const SET_WELL_VERT_DRILL_AFE = 'SET_WELL_VERT_DRILL_AFE'
interface SetWellVertDrillAFEAction {
  type: typeof SET_WELL_VERT_DRILL_AFE
  payload: {
    wellID: number
    afe: number
  }
}
export const SET_WELL_HORZ_DRILL_AFE = 'SET_WELL_HORZ_DRILL_AFE'
interface SetWellHorzDrillAFEAction {
  type: typeof SET_WELL_HORZ_DRILL_AFE
  payload: {
    wellID: number
    afe: number
  }
}
export const SET_WELL_DRILL_REHAB_AFE = 'SET_WELL_DRILL_REHAB_AFE'
interface SetWellDrillRehabAFEAction {
  type: typeof SET_WELL_DRILL_REHAB_AFE
  payload: {
    wellID: number
    afe: number
  }
}
export const SET_WELL_FRAC_AFE = 'SET_WELL_FRAC_AFE'
interface SetWellFracAFEAction {
  type: typeof SET_WELL_FRAC_AFE
  payload: {
    wellID: number
    afe: number
  }
}
export const SET_WELL_COMPLETIONS_REHAB_AFE = 'SET_WELL_COMPLETIONS_REHAB_AFE'
interface SetWellCompletionsRehabAFEAction {
  type: typeof SET_WELL_COMPLETIONS_REHAB_AFE
  payload: {
    wellID: number
    afe: number
  }
}
export const SET_WELL_WATER_TRANSFER_AFE = 'SET_WELL_WATER_TRANSFER_AFE'
interface SetWellWaterTransferAFEAction {
  type: typeof SET_WELL_WATER_TRANSFER_AFE
  payload: {
    wellID: number
    afe: number
  }
}
export const SET_WELL_DRILL_OUT_AFE = 'SET_WELL_DRILL_OUT_AFE'
interface SetWellDrillOutAFEAction {
  type: typeof SET_WELL_DRILL_OUT_AFE
  payload: {
    wellID: number
    afe: number
  }
}
export const SET_WELL_FACILITIES_AFE = 'SET_WELL_FACILITIES_AFE'
interface SetWellFacilitiesAFEAction {
  type: typeof SET_WELL_FACILITIES_AFE
  payload: {
    wellID: number
    afe: number
  }
}
export const SET_WELL_FLOWBACK_AFE = 'SET_WELL_FLOWBACK_AFE'
interface SetWellFlowbackAFEAction {
  type: typeof SET_WELL_FLOWBACK_AFE
  payload: {
    wellID: number
    afe: number
  }
}

/*********************
 * Durations
 ********************/
type DurationActionTypes = SetWellDrillDurationAction | SetWellVertDrillDurationAction | SetWellHorzDrillDurationAction | SetWellFracDurationAction | SetWellDrillOutDurationAction | SetWellVertDrillDurationDefaultAction | SetWellHorzDrillDurationDefaultAction | SetWellVertDrillDurationManualAction | SetWellHorzDrillDurationManualAction
export const SET_WELL_DRILL_DURATION = 'SET_WELL_DRILL_DURATION'
interface SetWellDrillDurationAction {
  type: typeof SET_WELL_DRILL_DURATION
  payload: {
    wellID: number
    duration: number
  }
}
export const SET_WELL_VERT_DRILL_DURATION = 'SET_WELL_VERT_DRILL_DURATION'
interface SetWellVertDrillDurationAction {
  type: typeof SET_WELL_VERT_DRILL_DURATION
  payload: {
    wellID: number
    duration: number
  }
}
export const SET_WELL_HORZ_DRILL_DURATION = 'SET_WELL_HORZ_DRILL_DURATION'
interface SetWellHorzDrillDurationAction {
  type: typeof SET_WELL_HORZ_DRILL_DURATION
  payload: {
    wellID: number
    duration: number
  }
}
export const SET_WELL_FRAC_DURATION = 'SET_WELL_FRAC_DURATION'
interface SetWellFracDurationAction {
  type: typeof SET_WELL_FRAC_DURATION
  payload: {
    wellID: number
    duration: number
  }
}
export const SET_WELL_DRILL_OUT_DURATION = 'SET_WELL_DRILL_OUT_DURATION'
interface SetWellDrillOutDurationAction {
  type: typeof SET_WELL_DRILL_OUT_DURATION
  payload: {
    wellID: number
    duration: number
  }
}
export const SET_WELL_VERT_DRILL_DURATION_DEFAULT = 'SET_WELL_VERT_DRILL_DURATION_DEFAULT'
interface SetWellVertDrillDurationDefaultAction {
  type: typeof SET_WELL_VERT_DRILL_DURATION_DEFAULT
  payload: {
    wellID: number
    duration: number
  }
}
export const SET_WELL_HORZ_DRILL_DURATION_DEFAULT = 'SET_WELL_HORZ_DRILL_DURATION_DEFAULT'
interface SetWellHorzDrillDurationDefaultAction {
  type: typeof SET_WELL_HORZ_DRILL_DURATION_DEFAULT
  payload: {
    wellID: number
    duration: number
  }
}
export const SET_WELL_VERT_DRILL_DURATION_MANUAL = 'SET_WELL_VERT_DRILL_DURATION_MANUAL'
interface SetWellVertDrillDurationManualAction {
  type: typeof SET_WELL_VERT_DRILL_DURATION_MANUAL
  payload: {
    wellID: number
    duration: number
  }
}
export const SET_WELL_HORZ_DRILL_DURATION_MANUAL = 'SET_WELL_HORZ_DRILL_DURATION_MANUAL'
interface SetWellHorzDrillDurationManualAction {
  type: typeof SET_WELL_HORZ_DRILL_DURATION_MANUAL
  payload: {
    wellID: number
    duration: number
  }
}

export type WellActionTypes = OtherActionTypes | SourceDataActionTypes | DrillOrderActionTypes | DateActionTypes | CostActionTypes | DefaultCostActionTypes | AFECostActionTypes | DurationActionTypes