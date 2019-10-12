/* eslint-disable default-case */
import { WellActionTypes, SET_WELLS, SET_WELL_PADID, SET_WELL_AVG_SPACING, SET_WELL_FRAC_STAGES, SET_WELL_STAGES_PER_DAY, SET_WELL_FRAC_DESIGN,

         SET_WELL_CONSTRUCTION_COST, SET_WELL_VERT_DRILL_COST, SET_WELL_HORZ_DRILL_COST, SET_WELL_DRILL_REHAB_COST,
         SET_WELL_FRAC_COST, SET_WELL_COMPLETIONS_REHAB_COST, SET_WELL_WATER_TRANSFER_COST, SET_WELL_DRILL_OUT_COST, SET_WELL_FACILITIES_COST, SET_WELL_FLOWBACK_COST,
         SET_WELL_CONSTRUCTION_COST_DEFAULT, SET_WELL_VERT_DRILL_COST_DEFAULT, SET_WELL_HORZ_DRILL_COST_DEFAULT, SET_WELL_DRILL_REHAB_COST_DEFAULT,
         SET_WELL_FRAC_COST_DEFAULT, SET_WELL_COMPLETIONS_REHAB_COST_DEFAULT, SET_WELL_WATER_TRANSFER_COST_DEFAULT, SET_WELL_DRILL_OUT_COST_DEFAULT, SET_WELL_FACILITIES_COST_DEFAULT, SET_WELL_FLOWBACK_COST_DEFAULT,
         SET_WELL_CONSTRUCTION_AFE, SET_WELL_VERT_DRILL_AFE, SET_WELL_HORZ_DRILL_AFE, SET_WELL_DRILL_REHAB_AFE,
         SET_WELL_FRAC_AFE, SET_WELL_COMPLETIONS_REHAB_AFE, SET_WELL_WATER_TRANSFER_AFE, SET_WELL_DRILL_OUT_AFE, SET_WELL_FACILITIES_AFE, SET_WELL_FLOWBACK_AFE,

         SET_WELL_VERT_DRILL_DURATION, SET_WELL_HORZ_DRILL_DURATION, SET_WELL_FRAC_DURATION, SET_WELL_DRILL_OUT_DURATION,
         
         SET_WELL_VERT_DRILL_START, SET_WELL_VERT_DRILL_END, SET_WELL_HORZ_DRILL_START, SET_WELL_HORZ_DRILL_END, 
        
         SET_WELL_VERT_DRILL_DURATION_DEFAULT, SET_WELL_HORZ_DRILL_DURATION_DEFAULT, SET_WELL_VERT_DRILL_DURATION_MANUAL, SET_WELL_HORZ_DRILL_DURATION_MANUAL, SET_WELL_DRILL_DURATION,
         SET_WELL_PREDECESSOR, SET_WELL_VERT_DRILL_ORDER_DEFAULT, SET_WELL_VERT_DRILL_ORDER_MANUAL, SET_WELL_VERT_DRILL_ORDER,
         SET_WELL_HORZ_DRILL_ORDER_DEFAULT, SET_WELL_HORZ_DRILL_ORDER_MANUAL, SET_WELL_HORZ_DRILL_ORDER, SET_WELL_CONSTRUCTION_START, SET_WELL_CONSTRUCTION_END, SET_WELL_FRAC_START, SET_WELL_FRAC_END, SET_WELL_DRILL_OUT_START, SET_WELL_DRILL_OUT_END, SET_WELL_FACILITIES_START, SET_WELL_FACILITIES_END, SET_WELL_TIL, SET_WELL_FIRST_FLOW, SET_WELL_NAME, SET_WELL_SURFACE_LOCATION, SET_GP_WELL_NO, SET_WELL_WI, SET_LATERAL_LENGTH, SET_TVD, SET_TMD, SET_SPACING_LEFT, SET_SPACING_RIGHT, SET_FORMATION, SET_PHASE_WINDOW, SET_DISTRICT_TOWNSHIP, SET_LATERAL_SITE, SET_UNIT_ID, SET_UNIT,  
} from '../action-types/well-action-types'
import {
  PadActionTypes, SET_PAD_CONSTRUCTION_START, SET_PAD_CONSTRUCTION_END, SET_PAD_FRAC_START, SET_PAD_FRAC_END, SET_PAD_DRILL_OUT_START, SET_PAD_DRILL_OUT_END, SET_PAD_FACILITIES_START, SET_PAD_FACILITIES_END, SET_PAD_TIL, SET_PAD_FIRST_FLOW,
} from '../action-types/pad-action-types'
import { DurationType, AFEType, Wells, Well, PartialRecord } from '../../types'

// export const wells = (state = {}, { type, payload }) => {
export const wells = (state: Wells = {}, actionsObj): Wells => {
  let actions: (WellActionTypes | PadActionTypes)[] = Array.isArray(actionsObj) ? actionsObj : [actionsObj], newState = state
  for (let action of actions) {
    switch (action.type) {
      case SET_WELLS:
        newState = action.payload
        break
      // well
      case SET_WELL_NAME:
      case SET_WELL_SURFACE_LOCATION:
      case SET_WELL_AVG_SPACING:
      case SET_WELL_FRAC_DESIGN:
      case SET_WELL_FRAC_STAGES:
      case SET_WELL_STAGES_PER_DAY:
      case SET_GP_WELL_NO:
      case SET_WELL_WI:
      case SET_LATERAL_LENGTH:
      case SET_TVD:
      case SET_TMD:
      case SET_SPACING_LEFT:
      case SET_SPACING_RIGHT:
      case SET_FORMATION:
      case SET_PHASE_WINDOW:
      case SET_DISTRICT_TOWNSHIP:
      case SET_LATERAL_SITE:
      case SET_UNIT_ID:
      case SET_UNIT:
      case SET_WELL_DRILL_DURATION:
      case SET_WELL_VERT_DRILL_DURATION:
      case SET_WELL_HORZ_DRILL_DURATION:
      case SET_WELL_FRAC_DURATION:
      case SET_WELL_DRILL_OUT_DURATION:
      case SET_WELL_VERT_DRILL_DURATION_DEFAULT:
      case SET_WELL_HORZ_DRILL_DURATION_DEFAULT:
      case SET_WELL_VERT_DRILL_DURATION_MANUAL:
      case SET_WELL_HORZ_DRILL_DURATION_MANUAL:
      case SET_WELL_CONSTRUCTION_COST:
      case SET_WELL_VERT_DRILL_COST:
      case SET_WELL_HORZ_DRILL_COST:
      case SET_WELL_DRILL_REHAB_COST:
      case SET_WELL_FRAC_COST:
      case SET_WELL_COMPLETIONS_REHAB_COST:
      case SET_WELL_WATER_TRANSFER_COST:
      case SET_WELL_DRILL_OUT_COST:
      case SET_WELL_FACILITIES_COST:
      case SET_WELL_FLOWBACK_COST:
      case SET_WELL_CONSTRUCTION_COST_DEFAULT:
      case SET_WELL_VERT_DRILL_COST_DEFAULT:
      case SET_WELL_HORZ_DRILL_COST_DEFAULT:
      case SET_WELL_DRILL_REHAB_COST_DEFAULT:
      case SET_WELL_FRAC_COST_DEFAULT:
      case SET_WELL_COMPLETIONS_REHAB_COST_DEFAULT:
      case SET_WELL_WATER_TRANSFER_COST_DEFAULT:
      case SET_WELL_DRILL_OUT_COST_DEFAULT:
      case SET_WELL_FACILITIES_COST_DEFAULT:
      case SET_WELL_FLOWBACK_COST_DEFAULT:
      case SET_WELL_CONSTRUCTION_AFE:
      case SET_WELL_VERT_DRILL_AFE:
      case SET_WELL_HORZ_DRILL_AFE:
      case SET_WELL_DRILL_REHAB_AFE:
      case SET_WELL_FRAC_AFE:
      case SET_WELL_COMPLETIONS_REHAB_AFE:
      case SET_WELL_WATER_TRANSFER_AFE:
      case SET_WELL_DRILL_OUT_AFE:
      case SET_WELL_FACILITIES_AFE:
      case SET_WELL_FLOWBACK_AFE:
      case SET_WELL_CONSTRUCTION_START:
      case SET_WELL_CONSTRUCTION_END:
      case SET_WELL_VERT_DRILL_START:
      case SET_WELL_VERT_DRILL_END:
      case SET_WELL_HORZ_DRILL_START:
      case SET_WELL_HORZ_DRILL_END:
      case SET_WELL_FRAC_START:
      case SET_WELL_FRAC_END:
      case SET_WELL_DRILL_OUT_START:
      case SET_WELL_DRILL_OUT_END:
      case SET_WELL_FACILITIES_START:
      case SET_WELL_FACILITIES_END:
      case SET_WELL_TIL:
      case SET_WELL_FIRST_FLOW:
      case SET_WELL_PADID:
      case SET_WELL_PREDECESSOR:
      case SET_WELL_VERT_DRILL_ORDER_DEFAULT:
      case SET_WELL_VERT_DRILL_ORDER_MANUAL:
      case SET_WELL_VERT_DRILL_ORDER:
      case SET_WELL_HORZ_DRILL_ORDER_DEFAULT:
      case SET_WELL_HORZ_DRILL_ORDER_MANUAL:
      case SET_WELL_HORZ_DRILL_ORDER:
        newState = {
          ...newState,
          [action.payload.wellID] : well(newState[action.payload.wellID], action)
        }
        break
      case SET_PAD_CONSTRUCTION_START:
      case SET_PAD_CONSTRUCTION_END:
      case SET_PAD_FRAC_START:
      case SET_PAD_FRAC_END:
      case SET_PAD_DRILL_OUT_START:
      case SET_PAD_DRILL_OUT_END:
      case SET_PAD_FACILITIES_START:
      case SET_PAD_FACILITIES_END:
      case SET_PAD_TIL:
      case SET_PAD_FIRST_FLOW:
        let padID = action.payload.padID
        for (let w of Object.values(newState).filter(w => w.padID === padID)) {
          newState = {
            ...newState,
            [w.wellID] : well(w, action)
          }
        }
        break
    }
  }
  return newState
}

const well = (state: Well, action: WellActionTypes | PadActionTypes): Well => {
  switch (action.type) {
    case SET_WELL_NAME:
      return {
        ...state,
        wellName: action.payload.wellName
      }
    case SET_WELL_SURFACE_LOCATION:
    case SET_WELL_AVG_SPACING:
    case SET_WELL_FRAC_DESIGN:
    case SET_WELL_FRAC_STAGES:
    case SET_WELL_STAGES_PER_DAY:
    case SET_GP_WELL_NO:
    case SET_WELL_WI:
    case SET_LATERAL_LENGTH:
    case SET_TVD:
    case SET_TMD:
    case SET_SPACING_LEFT:
    case SET_SPACING_RIGHT:
    case SET_FORMATION:
    case SET_PHASE_WINDOW:
    case SET_DISTRICT_TOWNSHIP:
    case SET_LATERAL_SITE:
    case SET_UNIT_ID:
    case SET_UNIT:
    case SET_WELL_PADID:
    case SET_WELL_PREDECESSOR:
      return {
        ...state,
        ...action.payload
      }
    // durations
    case SET_WELL_DRILL_DURATION:
      return {
        ...state,
        drillDuration: action.payload.duration
      }
    case SET_WELL_VERT_DRILL_DURATION:
      return {
        ...state,
        vertDrillDuration: action.payload.duration
      }
    case SET_WELL_HORZ_DRILL_DURATION:
      return {
        ...state,
        horzDrillDuration: action.payload.duration
      }
    case SET_WELL_FRAC_DURATION:
      return {
        ...state,
        fracDuration: action.payload.duration
      }
    case SET_WELL_DRILL_OUT_DURATION:
      return {
        ...state,
        drillOutDuration: action.payload.duration
      }
    case SET_WELL_VERT_DRILL_DURATION_DEFAULT:
      return {
        ...state,
        vertDrillDurationDefault: action.payload.duration
      }
    case SET_WELL_HORZ_DRILL_DURATION_DEFAULT:
      return {
        ...state,
        horzDrillDurationDefault: action.payload.duration
      }
    case SET_WELL_VERT_DRILL_DURATION_MANUAL:
    case SET_WELL_HORZ_DRILL_DURATION_MANUAL:
      return {
        ...state,
        manualDurations: manualDurations(state.manualDurations, action)
      }
    // costs
    case SET_WELL_CONSTRUCTION_COST:
      return {
        ...state,
        constructionCost: action.payload.cost
      }
    case SET_WELL_VERT_DRILL_COST:
      return {
        ...state,
        vertDrillCost: action.payload.cost
      }
    case SET_WELL_HORZ_DRILL_COST:
      return {
        ...state,
        horzDrillCost: action.payload.cost
      }
    case SET_WELL_DRILL_REHAB_COST:
      return {
        ...state,
        drillRehabCost: action.payload.cost
      }
    case SET_WELL_FRAC_COST:
      return {
        ...state,
        fracCost: action.payload.cost
      }
    case SET_WELL_COMPLETIONS_REHAB_COST:
      return {
        ...state,
        completionsRehabCost: action.payload.cost
      }
    case SET_WELL_WATER_TRANSFER_COST:
      return {
        ...state,
        waterTransferCost: action.payload.cost
      }
    case SET_WELL_DRILL_OUT_COST:
      return {
        ...state,
        drillOutCost: action.payload.cost
      }
    case SET_WELL_FACILITIES_COST:
      return {
        ...state,
        facilitiesCost: action.payload.cost
      }
    case SET_WELL_FLOWBACK_COST:
      return {
        ...state,
        flowbackCost: action.payload.cost
      }
    case SET_WELL_CONSTRUCTION_COST_DEFAULT:
      return { ...state, constructionCostDefault: action.payload.cost }
    case SET_WELL_VERT_DRILL_COST_DEFAULT:
      return { ...state, vertDrillCostDefault: action.payload.cost }
    case SET_WELL_HORZ_DRILL_COST_DEFAULT:
      return { ...state, horzDrillCostDefault: action.payload.cost }
    case SET_WELL_DRILL_REHAB_COST_DEFAULT:
      return { ...state, drillRehabCostDefault: action.payload.cost }
    case SET_WELL_FRAC_COST_DEFAULT:
      return { ...state, fracCostDefault: action.payload.cost }
    case SET_WELL_COMPLETIONS_REHAB_COST_DEFAULT:
      return { ...state, completionsRehabCostDefault: action.payload.cost }
    case SET_WELL_WATER_TRANSFER_COST_DEFAULT:
      return { ...state, waterTransferCostDefault: action.payload.cost }
    case SET_WELL_DRILL_OUT_COST_DEFAULT:
     return { ...state, drillOutCostDefault: action.payload.cost }
    case SET_WELL_FACILITIES_COST_DEFAULT:
      return { ...state, facilitiesCostDefault: action.payload.cost }
    case SET_WELL_FLOWBACK_COST_DEFAULT:
      return { ...state, flowbackCostDefault: action.payload.cost }
    case SET_WELL_CONSTRUCTION_AFE:
    case SET_WELL_VERT_DRILL_AFE:
    case SET_WELL_HORZ_DRILL_AFE:
    case SET_WELL_DRILL_REHAB_AFE:
    case SET_WELL_FRAC_AFE:
    case SET_WELL_COMPLETIONS_REHAB_AFE:
    case SET_WELL_WATER_TRANSFER_AFE:
    case SET_WELL_DRILL_OUT_AFE:
    case SET_WELL_FACILITIES_AFE:
    case SET_WELL_FLOWBACK_AFE:
      return {
        ...state,
        afes: afes(state.afes, action)
      } 
    case SET_WELL_VERT_DRILL_START:
      return {
        ...state,
        vertDrillStart: action.payload.date
      }
    case SET_WELL_VERT_DRILL_END:
      return {
        ...state,
        vertDrillEnd: action.payload.date
      }
    case SET_WELL_HORZ_DRILL_START:
      return {
        ...state,
        horzDrillStart: action.payload.date
      }
    case SET_WELL_HORZ_DRILL_END:
      return {
        ...state,
        horzDrillEnd: action.payload.date
      }
    case SET_PAD_CONSTRUCTION_START:
    case SET_WELL_CONSTRUCTION_START:
      return {
        ...state,
        constructionStart: action.payload.date
      }
    case SET_PAD_CONSTRUCTION_END:
    case SET_WELL_CONSTRUCTION_END:
      return {
        ...state,
        constructionEnd: action.payload.date
      }
    case SET_PAD_FRAC_START:
    case SET_WELL_FRAC_START:
      return {
        ...state,
        fracStart: action.payload.date
      }
    case SET_PAD_FRAC_END:
    case SET_WELL_FRAC_END:
      return {
        ...state,
        fracEnd: action.payload.date
      }
    case SET_PAD_DRILL_OUT_START:
    case SET_WELL_DRILL_OUT_START:
      return {
        ...state,
        drillOutStart: action.payload.date
      }
    case SET_PAD_DRILL_OUT_END:
    case SET_WELL_DRILL_OUT_END:
      return {
        ...state,
        drillOutEnd: action.payload.date
      }
    case SET_PAD_FACILITIES_START:
    case SET_WELL_FACILITIES_START:
      return {
        ...state,
        facilitiesStart: action.payload.date
      }
    case SET_PAD_FACILITIES_END:
    case SET_WELL_FACILITIES_END:
      return {
        ...state,
        facilitiesEnd: action.payload.date
      }
    case SET_PAD_TIL:
    case SET_WELL_TIL:
      return {
        ...state,
        til: action.payload.date
      }
    case SET_PAD_FIRST_FLOW:
    case SET_WELL_FIRST_FLOW:
      return {
        ...state,
        firstFlow: action.payload.date
      }
    case SET_WELL_VERT_DRILL_ORDER_DEFAULT:
      return {
        ...state,
        vertDrillOrderDefault: action.payload.drillOrder
      }
    case SET_WELL_VERT_DRILL_ORDER_MANUAL:
      return {
        ...state,
        vertDrillOrderManual: action.payload.drillOrder
      }
    case SET_WELL_VERT_DRILL_ORDER:
      return {
        ...state,
        vertDrillOrder: action.payload.drillOrder
      }
    case SET_WELL_HORZ_DRILL_ORDER_DEFAULT:
      return {
        ...state,
        horzDrillOrderDefault: action.payload.drillOrder
      }
    case SET_WELL_HORZ_DRILL_ORDER_MANUAL:
      return {
        ...state,
        horzDrillOrderManual: action.payload.drillOrder
      }
    case SET_WELL_HORZ_DRILL_ORDER:
      return {
        ...state,
        horzDrillOrder: action.payload.drillOrder
      }
    default: return state
  }
}

const manualDurations = (state: PartialRecord<DurationType, number>, action: WellActionTypes): PartialRecord<DurationType, number> => {
  switch (action.type) {
    case SET_WELL_VERT_DRILL_DURATION_MANUAL:
      if (isNaN(action.payload.duration)) {
        let { [DurationType.VertDrill]: deletedVertDuration, ...newVertState } = state
        return newVertState
      } else {
        return {
          ...state,
          [DurationType.VertDrill]: action.payload.duration
        }
      }
    case SET_WELL_HORZ_DRILL_DURATION_MANUAL:
      if (isNaN(action.payload.duration)) {
        let { [DurationType.HorzDrill]: deletedHorzDuration, ...newHorzState } = state
        return newHorzState
      } else {
        return {
          ...state,
          [DurationType.HorzDrill]: action.payload.duration
        }
      }
  }
}

const afes = (state: PartialRecord<AFEType, number>, action: WellActionTypes): PartialRecord<AFEType, number> => {
  let afeType: AFEType
  switch (action.type) {
    case SET_WELL_CONSTRUCTION_AFE: afeType = AFEType.Construction; break
    case SET_WELL_VERT_DRILL_AFE: afeType = AFEType.VertDrill; break
    case SET_WELL_HORZ_DRILL_AFE: afeType = AFEType.HorzDrill; break
    case SET_WELL_DRILL_REHAB_AFE: afeType = AFEType.DrillRehab; break
    case SET_WELL_FRAC_AFE: afeType = AFEType.Frac; break
    case SET_WELL_COMPLETIONS_REHAB_AFE: afeType = AFEType.CompletionsRehab; break
    case SET_WELL_WATER_TRANSFER_AFE: afeType = AFEType.WaterTransfer; break
    case SET_WELL_DRILL_OUT_AFE: afeType = AFEType.DrillOut; break
    case SET_WELL_FACILITIES_AFE: afeType = AFEType.Facilities; break
    case SET_WELL_FLOWBACK_AFE: afeType = AFEType.Flowback; break
    default: return state
  }

  if (isNaN(action.payload.afe)) {
    let { [afeType]: deletedAFE, ...newAFEState } = state
    return newAFEState
  } else {
    return {
      ...state,
      [afeType]: action.payload.afe
    }
  }
}