import { SET_WELL_VERT_DRILL_START,                     SET_WELL_VERT_DRILL_END,
         SET_WELL_HORZ_DRILL_START,                     SET_WELL_HORZ_DRILL_END,
         SET_WELL_CONSTRUCTION_COST,         SET_WELL_VERT_DRILL_COST,          SET_WELL_HORZ_DRILL_COST,    SET_WELL_FRAC_COST,
         SET_WELL_DRILL_OUT_COST,                SET_WELL_FACILITIES_COST,             SET_WELL_FLOWBACK_COST,
         SET_WELL_AVG_SPACING,                   SET_WELL_FRAC_STAGES,                 SET_WELL_STAGES_PER_DAY,        SET_WELL_FRAC_DESIGN,
         SET_WELL_VERT_DRILL_DURATION,           SET_WELL_FRAC_DURATION,               SET_WELL_DRILL_OUT_DURATION,    // SET_WELL_DRILL_ORDERS,
         SET_WELLS,
         SET_WELL_HORZ_DRILL_DURATION,
         SET_WELL_VERT_DRILL_DURATION_DEFAULT,
         SET_WELL_VERT_DRILL_DURATION_MANUAL,
         SET_WELL_HORZ_DRILL_DURATION_DEFAULT,
         SET_WELL_HORZ_DRILL_DURATION_MANUAL,
         SET_WELL_PADID,
         SET_WELL_VERT_DRILL_ORDER_MANUAL,
         SET_WELL_VERT_DRILL_ORDER,
         SET_WELL_HORZ_DRILL_ORDER_MANUAL,
         SET_WELL_HORZ_DRILL_ORDER,
         SET_WELL_PREDECESSOR,
         SET_WELL_DRILL_DURATION,
         SET_WELL_CONSTRUCTION_COST_DEFAULT,
         SET_WELL_CONSTRUCTION_AFE,
         SET_WELL_VERT_DRILL_COST_DEFAULT,
         SET_WELL_VERT_DRILL_AFE,
         SET_WELL_HORZ_DRILL_COST_DEFAULT,
         SET_WELL_HORZ_DRILL_AFE,
         SET_WELL_DRILL_REHAB_COST,
         SET_WELL_DRILL_REHAB_AFE,
         SET_WELL_FRAC_COST_DEFAULT,
         SET_WELL_DRILL_OUT_COST_DEFAULT,
         SET_WELL_FACILITIES_COST_DEFAULT,
         SET_WELL_FLOWBACK_COST_DEFAULT,
         SET_WELL_DRILL_REHAB_COST_DEFAULT,
         SET_WELL_FRAC_AFE,
         SET_WELL_DRILL_OUT_AFE,
         SET_WELL_FACILITIES_AFE,
         SET_WELL_FLOWBACK_AFE,
         SET_WELL_COMPLETIONS_REHAB_COST,
         SET_WELL_WATER_TRANSFER_COST,
         SET_WELL_COMPLETIONS_REHAB_COST_DEFAULT,
         SET_WELL_WATER_TRANSFER_COST_DEFAULT,
         SET_WELL_COMPLETIONS_REHAB_AFE,
         SET_WELL_WATER_TRANSFER_AFE,
         SET_WELL_VERT_DRILL_ORDER_DEFAULT,
         SET_WELL_HORZ_DRILL_ORDER_DEFAULT,
         SET_WELL_FRAC_START,
         SET_WELL_FRAC_END,
         SET_WELL_DRILL_OUT_START,
         SET_WELL_DRILL_OUT_END,
         SET_WELL_FACILITIES_START,
         SET_WELL_FACILITIES_END,
         SET_WELL_TIL,
         SET_WELL_FIRST_FLOW,
         SET_WELL_CONSTRUCTION_START,
         SET_WELL_CONSTRUCTION_END,
         SET_WELL_NAME,
         SET_WELL_SURFACE_LOCATION,
         SET_GP_WELL_NO,
         WellActionTypes,
         SET_WELL_WI,
         SET_LATERAL_LENGTH,
         SET_TVD,
         SET_TMD,
         SET_SPACING_LEFT,
         SET_SPACING_RIGHT,
         SET_FORMATION,
         SET_PHASE_WINDOW,
         SET_DISTRICT_TOWNSHIP,
         SET_LATERAL_SITE,
         SET_UNIT_ID,
         SET_UNIT
         
} from '../action-types/well-action-types'
import { wells as wells_reducer } from '../reducers/wells-reducer'
import { calcPadFracDurationDefault, calcPadDrillOutDurationDefault, calcPadVertDrillCost, calcPadHorzDrillCost,
  calcPadFracCost, calcPadDrillOutCost, calcPadFacilitiesCost, calcPadFlowbackCost, calcPadDrillDuration,
  calcWellCount,
  calcPadFacilitiesDurationDefault,
  deleteTempPad,
  calcPadWorkingInterest,
  setPadName
} from './pad-actions'
import { sqlService } from '../../services'
import metricsHelper from '../../helpers/metrics-helper'
import { _Date, _G } from 'data-type-ext'
import { isNumber } from 'data-type-ext/_Number'
import { StoreState, Wells, ScheduleType, AFEType, DurationType, Well, PartialRecord } from '../../types';
import { Dispatcher } from '../middleware/batched-thunk';
import { coalesce } from 'data-type-ext/_G'

// DISPATCHERS

export const loadWells = (opsScheduleID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    Promise.all([
      sqlService.getWells(opsScheduleID),
      sqlService.getWellOverrides(opsScheduleID),
    ]).then(([wellModels, wellOverrideModels]) => {
      let wellsArray: Well[] = wellModels.map((m) => {
        let overrides = wellOverrideModels.find(o => o.wellID === m.wellID)
        return {
          ...m,
          vertDrillOrderManual: overrides.vertDrillOrder,
          horzDrillOrderManual: overrides.horzDrillOrder,
          manualDurations: {
            [DurationType.VertDrill]: overrides.vertDrillDuration,
            [DurationType.HorzDrill]: overrides.horzDrillDuration,
          },
          afes: {
            [AFEType.Construction]: overrides.constructionAFE,
            [AFEType.DrillRehab]: overrides.drillRehabAFE,
            [AFEType.CompletionsRehab]: overrides.completionsRehabAFE,
            [AFEType.WaterTransfer]: overrides.waterTransferAFE,
            [AFEType.VertDrill]: overrides.vertDrillAFE,
            [AFEType.HorzDrill]: overrides.horzDrillAFE,
            [AFEType.Frac]: overrides.fracAFE,
            [AFEType.DrillOut]: overrides.drillOutAFE,
            [AFEType.Facilities]: overrides.facilitiesAFE,
            [AFEType.Flowback]: overrides.flowbackAFE,
          }
        }
      })
      let wells: Wells = {}

      for (let well of wellsArray) {
        let wellOrderNum = getWellOrderNum_R(well, wellsArray)
        well.vertDrillOrderDefault = wellOrderNum * 2 - 1
        well.horzDrillOrderDefault = wellOrderNum * 2
        well.vertDrillOrder = coalesce(well.vertDrillOrderManual, well.vertDrillOrderDefault)
        well.horzDrillOrder = coalesce(well.horzDrillOrderManual, well.horzDrillOrderDefault)
        wells[well.wellID] = well
      }
      dispatcher.batchAction(a_setWells(newState, wells))
      resolve()
    })
  })
  // .catch(err => { throw Error('An error occurred while trying to load Wells: \n' + err.message) })
)

export const moveWell = (wellID: number, newPredecessorWellID: number, newPadID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise ((resolve, reject) => {
    if (!isNumber(newPadID))
      throw Error(`Failed to move WellID ${wellID}. New PadID cannot be blank.`)
    let { wells, pads } = newState, well = wells[wellID], oldPadID = well.padID
    if (well.padID === newPadID && well.predecessorWellID === newPredecessorWellID) { resolve(); return } // moved on itself

    let newSuccWell = isNumber(newPredecessorWellID)
        ? Object.values(wells).find(w => w.predecessorWellID === newPredecessorWellID)
        : Object.values(wells).find(w => w.padID === newPadID && !isNumber(w.predecessorWellID))
    let oldSuccWell = Object.values(wells).find(w => w.predecessorWellID === wellID)
    let oldPredWell = wells[well.predecessorWellID]

    let actions = []
    dispatcher.batchAction(a_setWellPredecessor(newState, wellID, newPredecessorWellID))
    let pad = pads[newPadID]
    dispatcher.batchAction(a_setWellConstructionStart(newState, wellID, pad ? pad.constructionStart : undefined))
    dispatcher.batchAction(a_setWellConstructionEnd(newState, wellID, pad ? pad.constructionEnd : undefined))
    dispatcher.batchAction(a_setWellFracStart(newState, wellID, pad ? pad.fracStart : undefined))
    dispatcher.batchAction(a_setWellFracEnd(newState, wellID, pad ? pad.fracEnd : undefined))
    dispatcher.batchAction(a_setWellDrillOutStart(newState, wellID, pad ? pad.drillOutStart : undefined))
    dispatcher.batchAction(a_setWellDrillOutEnd(newState, wellID, pad ? pad.drillOutEnd : undefined))
    dispatcher.batchAction(a_setWellFacilitiesStart(newState, wellID, pad ? pad.facilitiesStart : undefined))
    dispatcher.batchAction(a_setWellFacilitiesEnd(newState, wellID, pad ? pad.facilitiesEnd : undefined))
    dispatcher.batchAction(a_setWellTIL(newState, wellID, pad ? pad.til : undefined))
    dispatcher.batchAction(a_setWellFirstFlow(newState, wellID, pad ? pad.firstFlow : undefined))
    if (newSuccWell)
      dispatcher.batchAction(a_setWellPredecessor(newState, newSuccWell.wellID, wellID))
    if (oldSuccWell)
      dispatcher.batchAction(a_setWellPredecessor(newState, oldSuccWell.wellID, oldPredWell ? oldPredWell.wellID : undefined))
    if (well.padID !== newPadID) {
      dispatcher.batchAction(a_setWellPadID(newState, wellID, newPadID))
      if (newState.selectedStateCode === 'OH')   
        actions.push(dispatcher.dispatchSingle(calcWellName(wellID)))
      if (isNumber(newPadID))
        actions.push(dispatcher.dispatchSingle(calcWellCount(newPadID)))
      if (isNumber(oldPadID))
        actions.push(dispatcher.dispatchSingle(calcWellCount(oldPadID)))
    }

    if (isNumber(oldPadID)) {
      if (pads[oldPadID]) {
        dispatcher.batchAction(a_setWellVertDrillOrderManual(newState, wellID, undefined))
        dispatcher.batchAction(a_setWellHorzDrillOrderManual(newState, wellID, undefined))
      }
      var oldPadWells = Object.values(newState.wells).filter(w => w.padID === oldPadID)
      for (let w of oldPadWells)
        calcWellDrillOrder(w, oldPadWells, dispatcher, newState)
    }
    if (newPadID !== oldPadID) {
      var newPadWells = Object.values(newState.wells).filter(w => w.padID === newPadID)
      for (let w of newPadWells)
        calcWellDrillOrder(w, newPadWells, dispatcher, newState)
    }

    Promise.all(actions).then(() => {
      actions = []
      actions.push(dispatcher.dispatchSingle(calcWellStagesPerDay(wellID)))
      if (isNumber(newPadID)) {
        actions.push(
          dispatcher.dispatchSingle(calcPadDrillDuration(newPadID)),
          dispatcher.dispatchSingle(calcPadFracDurationDefault(newPadID)),
          dispatcher.dispatchSingle(calcPadDrillOutDurationDefault(newPadID)),
          dispatcher.dispatchSingle(calcPadFacilitiesDurationDefault(newPadID)),
        )
      }
      if (isNumber(oldPadID) && oldPadID !== newPadID) {
        actions.push(
          dispatcher.dispatchSingle(calcPadDrillDuration(oldPadID)),
          dispatcher.dispatchSingle(calcPadFracDurationDefault(oldPadID)),
          dispatcher.dispatchSingle(calcPadDrillOutDurationDefault(oldPadID)),
          dispatcher.dispatchSingle(calcPadFacilitiesDurationDefault(oldPadID)),
        )
      }
      Promise.all(actions).then(() => {
        actions = []
        if (isNumber(newPadID)) {
          actions.push(
            dispatcher.dispatchSingle(calcWellDrillDatesByPad(newPadID)),
            dispatcher.dispatchSingle(calcPadVertDrillCost(newPadID)),
            dispatcher.dispatchSingle(calcPadHorzDrillCost(newPadID)),
            dispatcher.dispatchSingle(calcPadFracCost(newPadID)),
            dispatcher.dispatchSingle(calcPadDrillOutCost(newPadID)),
            dispatcher.dispatchSingle(calcPadFacilitiesCost(newPadID)),
            dispatcher.dispatchSingle(calcPadFlowbackCost(newPadID)),
          )
          for (let w of Object.values(newState.wells).filter(w => w.padID === newPadID)) {
            actions.push(
              dispatcher.dispatchSingle(calcWellConstructionCostDefault(w.wellID)),
              dispatcher.dispatchSingle(calcWellDrillRehabCostDefault(w.wellID)),
              dispatcher.dispatchSingle(calcWellCompletionsRehabCostDefault(w.wellID)),
              dispatcher.dispatchSingle(calcWellWaterTransferCostDefault(w.wellID)),
              dispatcher.dispatchSingle(calcWellFacilitiesCostDefault(w.wellID)),
            )
          }
        }
        if (isNumber(oldPadID) && oldPadID !== newPadID) {
          actions.push(
            dispatcher.dispatchSingle(calcWellDrillDatesByPad(oldPadID)),
            dispatcher.dispatchSingle(calcPadVertDrillCost(oldPadID)),
            dispatcher.dispatchSingle(calcPadHorzDrillCost(oldPadID)),
            dispatcher.dispatchSingle(calcPadFracCost(oldPadID)),
            dispatcher.dispatchSingle(calcPadDrillOutCost(oldPadID)),
            dispatcher.dispatchSingle(calcPadFacilitiesCost(oldPadID)),
            dispatcher.dispatchSingle(calcPadFlowbackCost(oldPadID)),
          )
          for (let w of Object.values(newState.wells).filter(w => w.padID === oldPadID)) {
            actions.push(
              dispatcher.dispatchSingle(calcWellConstructionCostDefault(w.wellID)),
              dispatcher.dispatchSingle(calcWellDrillRehabCostDefault(w.wellID)),
              dispatcher.dispatchSingle(calcWellCompletionsRehabCostDefault(w.wellID)),
              dispatcher.dispatchSingle(calcWellWaterTransferCostDefault(w.wellID)),
              dispatcher.dispatchSingle(calcWellFacilitiesCostDefault(w.wellID)),
            )
          }
          if (newState.pads[oldPadID].temp && !newState.pads[oldPadID].wellCount) {
            actions.push(dispatcher.dispatchSingle(deleteTempPad(oldPadID)))
          }
        }
        Promise.all(actions).then(resolve)
      })
    })
  })  
)

const calcWellDrillOrder = (well: Well, wells: Well[], dispatcher: Dispatcher, newState: StoreState) => {
  let drillOrder = well.padID ? getWellOrderNum_R(well, wells) : undefined
  dispatcher.batchAction(a_setWellVertDrillOrderDefault(newState, well.wellID, drillOrder * 2 - 1))
  dispatcher.batchAction(a_setWellHorzDrillOrderDefault(newState, well.wellID, drillOrder * 2))
  let batchDrill = isNumber(well.padID) && newState.pads[well.padID].batchDrill
  dispatcher.batchAction(a_setWellVertDrillOrder(newState, well.wellID, batchDrill ? well.vertDrillOrderManual : drillOrder * 2 - 1))
  dispatcher.batchAction(a_setWellHorzDrillOrder(newState, well.wellID, batchDrill ? well.horzDrillOrderManual : drillOrder * 2))
}

export const calcWellName = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (newState.selectedStateCode !== 'OH') { resolve(); return }
    let well = newState.wells[wellID]
    let pad = newState.pads[well.padID]
    let padName = pad.isSplit ? pad.padName.replace(` - ${pad.activityCode}`, '') : pad.padName
    let wellName = `${padName} ${well.unitID} ${well.surfaceLocation || ''}${well.lateralSite}`
    if (well.wellName === wellName) { resolve(); return }
    dispatcher.batchAction(a_setWellName(newState, wellID, wellName))
    resolve()
  })
)

export const setWellSurfaceLocation = (wellID: number, surfaceLocation: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (newState.wells[wellID].surfaceLocation === surfaceLocation) { resolve(); return }
    dispatcher.batchAction(a_setWellSurfaceLocation(newState, wellID, surfaceLocation))
    dispatcher.dispatchSingle(calcWellName(wellID)).then(resolve)
  })
)

// Source Data
export const setGPWellNo = (wellID: number, gpWellNo: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setGPWellNo(newState, wellID, gpWellNo))
    resolve()
  })
)
export const setWellWI = (wellID: number, workingInterest: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setWellWI(newState, wellID, workingInterest))
    if (!isNumber(newState.wells[wellID].padID)) { resolve(); return }
    dispatcher.dispatchSingle(calcPadWorkingInterest(newState.wells[wellID].padID)).then(resolve)
  })
)
export const setLateralLength = (wellID: number, lateralLength: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setLateralLength(newState, wellID, lateralLength))
    dispatcher.dispatchMany([
      calcWellFracStages(wellID),
      calcWellHorzDrillCostDefault(wellID),
    ]).then(resolve)
  })
)
export const setTVD = (wellID: number, tvd: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setTVD(newState, wellID, tvd))
    dispatcher.dispatchSingle(calcWellVertDrillCostDefault(wellID)).then(resolve)
  })
)
export const setTMD = (wellID: number, tmd: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setTMD(newState, wellID, tmd))
    dispatcher.dispatchMany([
      calcWellFracCostDefault(wellID),
      calcWellStagesPerDay(wellID),
      calcWellFracDesign(wellID),
    ]).then(resolve)
  })
)
export const setSpacingLeft = (wellID: number, spacingLeft: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setSpacingLeft(newState, wellID, spacingLeft))
    dispatcher.dispatchSingle(calcWellAvgSpacing(wellID)).then(resolve)
  })
)
export const setSpacingRight = (wellID: number, spacingRight: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setSpacingRight(newState, wellID, spacingRight))
    dispatcher.dispatchSingle(calcWellAvgSpacing(wellID)).then(resolve)
  })
)
export const setFormation = (wellID: number, formation: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setFormation(newState, wellID, formation))
    dispatcher.dispatchMany([
      calcWellVertDrillDurationDefault(wellID),
      calcWellHorzDrillDurationDefault(wellID),
      calcWellVertDrillCostDefault(wellID),
      calcWellHorzDrillCostDefault(wellID),
    ]).then(resolve)
  })
)
export const setPhaseWindow = (wellID: number, phaseWindow: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setPhaseWindow(newState, wellID, phaseWindow))
    dispatcher.dispatchSingle(calcWellFacilitiesCostDefault(wellID)).then(resolve)
  })
)
export const setDistrictTownship = (wellID: number, districtTownship: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setDistrictTownship(newState, wellID, districtTownship))
    dispatcher.dispatchMany([
      calcWellVertDrillCostDefault(wellID),
      calcWellHorzDrillCostDefault(wellID),
    ]).then(resolve)
  })
)
export const setLateralSite = (wellID: number, lateralSite: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setLateralSite(newState, wellID, lateralSite))
    dispatcher.dispatchSingle(calcWellName(wellID)).then(resolve)
  })
)
export const setUnitID = (wellID: number, unitID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setUnitID(newState, wellID, unitID))
    dispatcher.dispatchSingle(calcWellName(wellID)).then(resolve)
    resolve()
  })
)
export const setUnit = (wellID: number, unit: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setUnit(newState, wellID, unit))
    if (!isNumber(newState.wells[wellID].padID)
      || newState.selectedStateCode !== 'OH'
      || !newState.pads[newState.wells[wellID].padID].temp
    ) { resolve(); return }
    dispatcher.dispatchSingle(setPadName(newState.wells[wellID].padID, `${unit} UNIT`)).then(resolve)
  })
)

export const calcAllWellScheduleCosts = (scheduleType: ScheduleType) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells } = newState, actions = []
    switch (scheduleType) {
      case ScheduleType.Construction:
        actions.push(calcWellConstructionCostDefault,
          calcWellDrillRehabCostDefault,
          calcWellCompletionsRehabCostDefault,
          calcWellWaterTransferCostDefault);
        break
      case ScheduleType.Drill: actions.push(calcWellVertDrillCostDefault, calcWellHorzDrillCostDefault); break
      case ScheduleType.Frac: actions.push(calcWellFracCostDefault); break
      case ScheduleType.DrillOut: actions.push(calcWellDrillOutCostDefault); break
      case ScheduleType.Facilities: actions.push(calcWellFacilitiesCostDefault); break
      case ScheduleType.Flowback: actions.push(calcWellFlowbackCostDefault); break
      default: return
    }  
    let dispatches = []
    for (let key of Object.keys(wells)) {
      dispatches.push(actions.map(a => dispatcher.dispatchSingle(a(+key)))) 
    }

    Promise.all([dispatches]).then(resolve)
  })
)

export const setWellAFE = (wellID: number, afeType: AFEType, afe) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let action
    switch (afeType) {
      case AFEType.Construction: action = setWellConstructionAFE; break
      case AFEType.VertDrill: action = setWellVertDrillAFE; break
      case AFEType.HorzDrill: action = setWellHorzDrillAFE; break
      case AFEType.DrillRehab: action = setWellDrillRehabAFE; break
      case AFEType.Frac: action = setWellFracAFE; break
      case AFEType.CompletionsRehab: action = setWellCompletionsRehabAFE; break
      case AFEType.WaterTransfer: action = setWellWaterTransferAFE; break
      case AFEType.DrillOut: action = setWellDrillOutAFE; break
      case AFEType.Facilities: action = setWellFacilitiesAFE; break
      case AFEType.Flowback: action = setWellFlowbackAFE; break
    }
    if (action) {
      dispatcher.dispatchSingle(action(wellID, afe)).then(resolve)
    } else {
      resolve()
    }
  })
)

// Pad Construction Cost
export const calcWellConstructionCostDefault = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics, pads } = newState, well = wells[wellID]
    let cost = well.padID ? metricsHelper.construction.getConstructionCosts(metrics.construction, pads[well.padID].wellCount) : undefined
    cost = isNumber(cost) ? cost : undefined
    if (cost !== well.constructionCostDefault)
      dispatcher.batchAction(a_setWellConstructionCostDefault(newState, wellID, cost))
    if (!hasDrillAFE(well.afes))
      dispatcher.dispatchSingle(setWellConstructionCost(wellID, cost)).then(resolve)
    else
      resolve()
  })
)
const setWellConstructionAFE = (wellID: number, afe: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (afe === well.afes.construction) { resolve(); return }
    dispatcher.batchAction(a_setWellConstructionAFE(newState, wellID, afe))
    if (hasDrillAFE(Object.assign({}, newState.wells[wellID].afes, { construction: afe }))) {
      dispatcher.dispatchMany([
        setWellConstructionCost(wellID, afe),
        setWellVertDrillCost(wellID, well.afes.vertDrill),
        setWellHorzDrillCost(wellID, well.afes.horzDrill),
        setWellDrillRehabCost(wellID, well.afes.drillRehab),
      ]).then(resolve)
    } else {
      dispatcher.dispatchMany([
        setWellConstructionCost(wellID, well.constructionCostDefault),
        setWellVertDrillCost(wellID, well.vertDrillCostDefault),
        setWellHorzDrillCost(wellID, well.horzDrillCostDefault),
        setWellDrillRehabCost(wellID, well.drillRehabCostDefault),
      ]).then(resolve)
    }
  })
)
export const setWellConstructionCost = (wellID: number, cost: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (cost !== well.constructionCost)
      dispatcher.batchAction(a_setWellConstructionCost(newState, wellID, cost))
    resolve()
  })
)

// Vert Drill Cost
export const calcWellVertDrillCostDefault = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics } = newState, well = wells[wellID]
    let cost = metricsHelper.drill.getVertDrillCost(metrics.drill, well, newState.selectedStateCode)
    cost = isNumber(cost) ? cost : undefined
    if (cost === well.vertDrillCostDefault) { resolve(); return }
    dispatcher.batchAction(a_setWellVertDrillCostDefault(newState, wellID, cost))
    Promise.all([
      dispatcher.dispatchSingle(calcWellHorzDrillCostDefault(wellID)),
      !hasDrillAFE(well.afes) ? dispatcher.dispatchSingle(setWellVertDrillCost(wellID, cost)) : undefined,
    ]).then(resolve)
  })
)
const setWellVertDrillAFE = (wellID: number, afe: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (afe === well.afes.vertDrill) { resolve(); return }
    dispatcher.batchAction(a_setWellVertDrillAFE(newState, wellID, afe))
    if (hasDrillAFE(Object.assign({}, newState.wells[wellID].afes, { vertDrill: afe }))) {
      dispatcher.dispatchMany([
        setWellConstructionCost(wellID, well.afes.construction),
        setWellVertDrillCost(wellID, afe),
        setWellHorzDrillCost(wellID, well.afes.horzDrill),
        setWellDrillRehabCost(wellID, well.afes.drillRehab),
      ]).then(resolve)
    } else {
      dispatcher.dispatchMany([
        setWellConstructionCost(wellID, well.constructionCostDefault),
        setWellVertDrillCost(wellID, well.vertDrillCostDefault),
        setWellHorzDrillCost(wellID, well.horzDrillCostDefault),
        setWellDrillRehabCost(wellID, well.drillRehabCostDefault),
      ]).then(resolve)
    }
  })
)
export const setWellVertDrillCost = (wellID: number, cost: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (cost === well.vertDrillCost) { resolve(); return }
    dispatcher.batchAction(a_setWellVertDrillCost(newState, wellID, cost))
    if (!well.padID) { resolve(); return }
    dispatcher.dispatchSingle(calcPadVertDrillCost(well.padID)).then(resolve)
  })
)

// Horz Drill Cost
export const calcWellHorzDrillCostDefault = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics } = newState, well = wells[wellID]
    let cost = metricsHelper.drill.getHorzDrillCost(metrics.drill, well, newState.selectedStateCode)
    cost = isNumber(cost) ? cost : undefined
    if (cost === well.horzDrillCostDefault) { resolve(); return }
    dispatcher.batchAction(a_setWellHorzDrillCostDefault(newState, wellID, cost))
    if (hasDrillAFE(well.afes)) { resolve(); return }
    dispatcher.dispatchSingle(setWellHorzDrillCost(wellID, cost)).then(resolve)
  })
)
const setWellHorzDrillAFE = (wellID: number, afe: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (afe === well.afes.horzDrill) { resolve(); return }
    dispatcher.batchAction(a_setWellHorzDrillAFE(newState, wellID, afe))
    if (hasDrillAFE(Object.assign({}, newState.wells[wellID].afes, { horzDrill: afe }))) {
      dispatcher.dispatchMany([
        setWellConstructionCost(wellID, well.afes.construction),
        setWellVertDrillCost(wellID, well.afes.vertDrill),
        setWellHorzDrillCost(wellID, afe),
        setWellDrillRehabCost(wellID, well.afes.drillRehab),
      ]).then(resolve)
    } else {
      dispatcher.dispatchMany([
        setWellConstructionCost(wellID, well.constructionCostDefault),
        setWellVertDrillCost(wellID, well.vertDrillCostDefault),
        setWellHorzDrillCost(wellID, well.horzDrillCostDefault),
        setWellDrillRehabCost(wellID, well.drillRehabCostDefault),
      ]).then(resolve)
    }
  })
)
export const setWellHorzDrillCost = (wellID: number, cost: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (cost === well.horzDrillCost) { resolve(); return }
    dispatcher.batchAction(a_setWellHorzDrillCost(newState, wellID, cost))
    if (!well.padID) { resolve(); return }
    dispatcher.dispatchSingle(calcPadHorzDrillCost(well.padID)).then(resolve)
  })
)

// Drill Rehab Cost
export const calcWellDrillRehabCostDefault = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics, pads } = newState, well = wells[wellID]
    let cost = well.padID ? metricsHelper.construction.getDrillRehabCosts(metrics.construction, pads[well.padID].wellCount) : undefined
    cost = isNumber(cost) ? cost : undefined
    if (cost === well.drillRehabCostDefault) { resolve(); return }
    dispatcher.batchAction(a_setWellDrillRehabCostDefault(newState, wellID, cost))
    if (hasDrillAFE(well.afes)) { resolve(); return }
    dispatcher.dispatchSingle(setWellDrillRehabCost(wellID, cost)).then(resolve)
  })
)
const setWellDrillRehabAFE = (wellID: number, afe: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (afe === well.afes.drillRehab) { resolve(); return }
    dispatcher.batchAction(a_setWellDrillRehabAFE(newState, wellID, afe))
    if (hasDrillAFE(Object.assign({}, newState.wells[wellID].afes, { drillRehab: afe }))) {
      dispatcher.dispatchMany([
        setWellConstructionCost(wellID, well.afes.construction),
        setWellVertDrillCost(wellID, well.afes.vertDrill),
        setWellHorzDrillCost(wellID, well.afes.horzDrill),
        setWellDrillRehabCost(wellID, afe),
      ]).then(resolve)
    } else {
      dispatcher.dispatchMany([
        setWellConstructionCost(wellID, well.constructionCostDefault),
        setWellVertDrillCost(wellID, well.vertDrillCostDefault),
        setWellHorzDrillCost(wellID, well.horzDrillCostDefault),
        setWellDrillRehabCost(wellID, well.drillRehabCostDefault),
      ]).then(resolve)
    }
  })
)
export const setWellDrillRehabCost = (wellID: number, cost: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (cost === well.drillRehabCost) { resolve(); return }
    dispatcher.batchAction(a_setWellDrillRehabCost(newState, wellID, cost))
    resolve()
  })
)

// Frac Cost
export const calcWellFracCostDefault = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics } = newState, well = wells[wellID]
    let cost = metricsHelper.frac.getCosts(metrics.frac, well.tmd, well.avgSpacing, well.fracDuration, well.fracStages)
    cost = isNumber(cost) ? cost : undefined
    if (cost === well.fracCostDefault) { resolve(); return }
    dispatcher.batchAction(a_setWellFracCostDefault(newState, wellID, cost))
    if (hasCompletionsAFE(well.afes)) { resolve(); return }
    dispatcher.dispatchSingle(setWellFracCost(wellID, cost)).then(resolve)
  })
)
const setWellFracAFE = (wellID: number, afe: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (afe === well.afes.frac) { resolve(); return }
    dispatcher.batchAction(a_setWellFracAFE(newState, wellID, afe))
    if (hasCompletionsAFE(Object.assign({}, newState.wells[wellID].afes, { frac: afe }))) {
      dispatcher.dispatchMany([
        setWellFracCost(wellID, afe),
        setWellCompletionsRehabCost(wellID, well.afes.completionsRehab),
        setWellWaterTransferCost(wellID, well.afes.waterTransfer),
        setWellDrillOutCost(wellID, well.afes.drillOut),
        setWellFacilitiesCost(wellID, well.afes.facilities),
        setWellFlowbackCost(wellID, well.afes.flowback),
      ]).then(resolve)
    } else {
      dispatcher.dispatchMany([
        setWellFracCost(wellID, afe),
        setWellCompletionsRehabCost(wellID, well.completionsRehabCostDefault),
        setWellWaterTransferCost(wellID, well.waterTransferCostDefault),
        setWellDrillOutCost(wellID, well.drillOutCostDefault),
        setWellFacilitiesCost(wellID, well.facilitiesCostDefault),
        setWellFlowbackCost(wellID, well.flowbackCostDefault),
      ]).then(resolve)
    }
  })
)
export const setWellFracCost = (wellID: number, cost: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (cost === well.fracCost) { resolve(); return }
    dispatcher.batchAction(a_setWellFracCost(newState, wellID, cost))
    if (!well.padID) { resolve(); return }
    dispatcher.dispatchSingle(calcPadFracCost(well.padID)).then(resolve)
  })
)

// Completions Rehab Cost
export const calcWellCompletionsRehabCostDefault = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics, pads } = newState, well = wells[wellID]
    let cost = well.padID ? metricsHelper.construction.getCompletionsRehabCosts(metrics.construction, pads[well.padID].wellCount) : undefined
    cost = isNumber(cost) ? cost : undefined
    if (cost === well.completionsRehabCostDefault) { resolve(); return }
    dispatcher.batchAction(a_setWellCompletionsRehabCostDefault(newState, wellID, cost))
    if (hasCompletionsAFE(well.afes)) { resolve(); return }
    dispatcher.dispatchSingle(setWellCompletionsRehabCost(wellID, cost)).then(resolve)
  })
)
const setWellCompletionsRehabAFE = (wellID: number, afe: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (afe === well.afes.completionsRehab) { resolve(); return }
    dispatcher.batchAction(a_setWellCompletionsRehabAFE(newState, wellID, afe))
    if (hasCompletionsAFE(Object.assign({}, newState.wells[wellID].afes, { completionsRehab: afe }))) {
      dispatcher.dispatchMany([
        setWellFracCost(wellID, well.afes.frac),
        setWellCompletionsRehabCost(wellID, afe),
        setWellWaterTransferCost(wellID, well.afes.waterTransfer),
        setWellDrillOutCost(wellID, well.afes.drillOut),
        setWellFacilitiesCost(wellID, well.afes.facilities),
        setWellFlowbackCost(wellID, well.afes.flowback),
      ]).then(resolve)
    } else {
      dispatcher.dispatchMany([
        setWellFracCost(wellID, afe),
        setWellCompletionsRehabCost(wellID, well.completionsRehabCostDefault),
        setWellWaterTransferCost(wellID, well.waterTransferCostDefault),
        setWellDrillOutCost(wellID, well.drillOutCostDefault),
        setWellFacilitiesCost(wellID, well.facilitiesCostDefault),
        setWellFlowbackCost(wellID, well.flowbackCostDefault),
      ]).then(resolve)
    }
  })
)
export const setWellCompletionsRehabCost = (wellID: number, cost: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (cost === well.completionsRehabCost) { resolve(); return }
    dispatcher.batchAction(a_setWellCompletionsRehabCost(newState, wellID, cost))
    resolve()
  })
)

// Water Transfer Cost
export const calcWellWaterTransferCostDefault = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics, pads } = newState, well = wells[wellID]
    let cost = well.padID ? metricsHelper.construction.getWaterTransferCosts(metrics.construction, pads[well.padID].wellCount) : undefined
    cost = isNumber(cost) ? cost : undefined
    if (cost === well.waterTransferCostDefault) { resolve(); return }
    dispatcher.batchAction(a_setWellWaterTransferCostDefault(newState, wellID, cost))
    if (hasCompletionsAFE(well.afes)) { resolve(); return }
    dispatcher.dispatchSingle(setWellWaterTransferCost(wellID, cost)).then(resolve)
  })
)
const setWellWaterTransferAFE = (wellID: number, afe: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (afe === well.afes.waterTransfer) { resolve(); return }
    dispatcher.batchAction(a_setWellWaterTransferAFE(newState, wellID, afe))
    if (hasCompletionsAFE(Object.assign({}, newState.wells[wellID].afes, { waterTransfer: afe }))) {
      dispatcher.dispatchMany([
        setWellFracCost(wellID, well.afes.frac),
        setWellCompletionsRehabCost(wellID, well.afes.completionsRehab),
        setWellWaterTransferCost(wellID, afe),
        setWellDrillOutCost(wellID, well.afes.drillOut),
        setWellFacilitiesCost(wellID, well.afes.facilities),
        setWellFlowbackCost(wellID, well.afes.flowback),
      ]).then(resolve)
    } else {
      dispatcher.dispatchMany([
        setWellFracCost(wellID, afe),
        setWellCompletionsRehabCost(wellID, well.completionsRehabCostDefault),
        setWellWaterTransferCost(wellID, well.waterTransferCostDefault),
        setWellDrillOutCost(wellID, well.drillOutCostDefault),
        setWellFacilitiesCost(wellID, well.facilitiesCostDefault),
        setWellFlowbackCost(wellID, well.flowbackCostDefault),
      ]).then(resolve)
    }
  })
)
export const setWellWaterTransferCost = (wellID: number, cost: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (cost === well.waterTransferCost) { resolve(); return }
    dispatcher.batchAction(a_setWellWaterTransferCost(newState, wellID, cost))
    resolve()
  })
)

// Drill Out Cost
export const calcWellDrillOutCostDefault = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics } = newState, well = wells[wellID]
    let cost = metricsHelper.drillOut.getCosts(metrics.drillOut)
    cost = isNumber(cost) ? cost : undefined
    if (cost === well.drillOutCostDefault) { resolve(); return }
    dispatcher.batchAction(a_setWellDrillOutCostDefault(newState, wellID, cost))
    if (hasCompletionsAFE(well.afes)) { resolve(); return }
    dispatcher.dispatchSingle(setWellDrillOutCost(wellID, cost)).then(resolve)
  })
)
const setWellDrillOutAFE = (wellID: number, afe: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (afe === well.afes.drillOut) { resolve(); return }
    dispatcher.batchAction(a_setWellDrillOutAFE(newState, wellID, afe))
    if (hasCompletionsAFE(Object.assign({}, newState.wells[wellID].afes, { drillOut: afe }))) {
      dispatcher.dispatchMany([
        setWellFracCost(wellID, well.afes.frac),
        setWellCompletionsRehabCost(wellID, well.afes.completionsRehab),
        setWellWaterTransferCost(wellID, well.afes.waterTransfer),
        setWellDrillOutCost(wellID, afe),
        setWellFacilitiesCost(wellID, well.afes.facilities),
        setWellFlowbackCost(wellID, well.afes.flowback),
      ]).then(resolve)
    } else {
      dispatcher.dispatchMany([
        setWellFracCost(wellID, afe),
        setWellCompletionsRehabCost(wellID, well.completionsRehabCostDefault),
        setWellWaterTransferCost(wellID, well.waterTransferCostDefault),
        setWellDrillOutCost(wellID, well.drillOutCostDefault),
        setWellFacilitiesCost(wellID, well.facilitiesCostDefault),
        setWellFlowbackCost(wellID, well.flowbackCostDefault),
      ]).then(resolve)
    }
  })
)
export const setWellDrillOutCost = (wellID: number, cost: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (cost === well.drillOutCost) { resolve(); return }
    dispatcher.batchAction(a_setWellDrillOutCost(newState, wellID, cost))
    if (!well.padID) { resolve(); return }
    dispatcher.dispatchSingle(calcPadDrillOutCost(well.padID)).then(resolve)
  })
)

// Facilities Cost
export const calcWellFacilitiesCostDefault = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics, pads } = newState, well = wells[wellID]
    let cost = well.padID ? metricsHelper.facilities.getCosts(metrics.facilities, pads[well.padID].wellCount, well.phaseWindow) : undefined
    cost = isNumber(cost) ? cost : undefined
    if (cost === well.facilitiesCostDefault) { resolve(); return }
    dispatcher.batchAction(a_setWellFacilitiesCostDefault(newState, wellID, cost))
    if (hasCompletionsAFE(well.afes)) { resolve(); return }
    dispatcher.dispatchSingle(setWellFacilitiesCost(wellID, cost)).then(resolve)
  })
)
const setWellFacilitiesAFE = (wellID: number, afe: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (afe === well.afes.facilities) { resolve(); return }
    dispatcher.batchAction(a_setWellFacilitiesAFE(newState, wellID, afe))
    if (hasCompletionsAFE(Object.assign({}, newState.wells[wellID].afes, { facilities: afe }))) {
      dispatcher.dispatchMany([
        setWellFracCost(wellID, well.afes.frac),
        setWellCompletionsRehabCost(wellID, well.afes.completionsRehab),
        setWellWaterTransferCost(wellID, well.afes.waterTransfer),
        setWellDrillOutCost(wellID, well.afes.drillOut),
        setWellFacilitiesCost(wellID, afe),
        setWellFlowbackCost(wellID, well.afes.flowback),
      ]).then(resolve)
    } else {
      dispatcher.dispatchMany([
        setWellFracCost(wellID, afe),
        setWellCompletionsRehabCost(wellID, well.completionsRehabCostDefault),
        setWellWaterTransferCost(wellID, well.waterTransferCostDefault),
        setWellDrillOutCost(wellID, well.drillOutCostDefault),
        setWellFacilitiesCost(wellID, well.facilitiesCostDefault),
        setWellFlowbackCost(wellID, well.flowbackCostDefault),
      ]).then(resolve)
    }
  })
)
export const setWellFacilitiesCost = (wellID: number, cost: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (cost === well.facilitiesCost) { resolve(); return }
    dispatcher.batchAction(a_setWellFacilitiesCost(newState, wellID, cost))
    if (!well.padID) { resolve(); return }
    dispatcher.dispatchSingle(calcPadFacilitiesCost(well.padID)).then(resolve)
  })
)

// Flowback Cost
export const calcWellFlowbackCostDefault = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics } = newState, well = wells[wellID]
    let cost = metricsHelper.flowback.getCosts(metrics.flowback)
    cost = isNumber(cost) ? cost : undefined
    if (cost === well.flowbackCostDefault) { resolve(); return }
    dispatcher.batchAction(a_setWellFlowbackCostDefault(newState, wellID, cost))
    if (hasCompletionsAFE(well.afes)) { resolve(); return }
    dispatcher.dispatchSingle(setWellFlowbackCost(wellID, cost)).then(resolve)
  })
)
const setWellFlowbackAFE = (wellID: number, afe: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (afe === well.afes.flowback) { resolve(); return }
    dispatcher.batchAction(a_setWellFlowbackAFE(newState, wellID, afe))
    if (hasCompletionsAFE(Object.assign({}, newState.wells[wellID].afes, { flowback: afe }))) {
      dispatcher.dispatchMany([
        setWellFracCost(wellID, well.afes.frac),
        setWellCompletionsRehabCost(wellID, well.afes.completionsRehab),
        setWellWaterTransferCost(wellID, well.afes.waterTransfer),
        setWellDrillOutCost(wellID, well.afes.drillOut),
        setWellFacilitiesCost(wellID, well.afes.facilities),
        setWellFlowbackCost(wellID, afe),
      ]).then(resolve)
    } else {
      dispatcher.dispatchMany([
        setWellFracCost(wellID, afe),
        setWellCompletionsRehabCost(wellID, well.completionsRehabCostDefault),
        setWellWaterTransferCost(wellID, well.waterTransferCostDefault),
        setWellDrillOutCost(wellID, well.drillOutCostDefault),
        setWellFacilitiesCost(wellID, well.facilitiesCostDefault),
        setWellFlowbackCost(wellID, well.flowbackCostDefault),
      ]).then(resolve)
    }
  })
)
export const setWellFlowbackCost = (wellID: number, cost: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (cost === well.flowbackCost) { resolve(); return }
    dispatcher.batchAction(a_setWellFlowbackCost(newState, wellID, cost))
    if (!well.padID) { resolve(); return }
    dispatcher.dispatchSingle(calcPadFlowbackCost(well.padID)).then(resolve)
  })
)

export const calcWellAvgSpacing = (wellID: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    let avgSpacing = (well.spacingLeft + well.spacingRight) / 2
    avgSpacing = isNumber(avgSpacing) ? avgSpacing : undefined
    if (avgSpacing === well.avgSpacing) { resolve(); return }
    dispatcher.batchAction(a_setWellAvgSpacing(newState, wellID, avgSpacing))
    Promise.all([
      dispatcher.dispatchSingle(calcWellFracDesign(wellID)),
      dispatcher.dispatchSingle(calcWellStagesPerDay(wellID, dispatchTriggers)),
    ]).then(resolve)
  })
)

export const calcWellFracStages = (wellID: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics } = newState, well = wells[wellID]
    let stages = well.lateralLength / (metrics.frac.timing.stageLength === 0 ? undefined : metrics.frac.timing.stageLength)
    stages = isNumber(stages) ? stages : undefined
    if (stages === well.fracStages) { resolve(); return }
    dispatcher.batchAction(a_setWellFracStages(newState, wellID, stages))
    dispatcher.dispatchSingle(calcWellFracDuration(wellID, dispatchTriggers)).then(resolve)
  })
)

export const calcWellStagesPerDay = (wellID: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, pads, metrics } = newState, well = wells[wellID]
    let pad = well.padID ? pads[well.padID] : undefined

    let matrixObj = metricsHelper.frac.getMatrixObj(metrics.frac, well.tmd, well.avgSpacing)
    let baseStagesPerDay = matrixObj ? matrixObj.baseStagesPerDay : undefined
    let delayedStagesPerDay = (pad && isWinterMonth(pad.fracStart)) ? metrics.frac.timing.winterStagesPerDayDelay : 0
    let stagesPerDay = baseStagesPerDay - delayedStagesPerDay
    stagesPerDay = isNumber(stagesPerDay) ? stagesPerDay : undefined
    if (stagesPerDay === well.stagesPerDay) { resolve(); return }
    dispatcher.batchAction(a_setWellStagesPerDay(newState, wellID, stagesPerDay))
    dispatcher.dispatchSingle(calcWellFracDuration(wellID, dispatchTriggers)).then(resolve)
  })
)

const calcWellFracDesign = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics } = newState, well = wells[wellID]
    let matrixObj = metricsHelper.frac.getMatrixObj(metrics.frac, well.tmd, well.avgSpacing)
    let fracDesign = matrixObj ? matrixObj.fracDesign : undefined
    if (fracDesign === well.fracDesign) { resolve(); return }
    dispatcher.batchAction(a_setWellFracDesign(newState, wellID, fracDesign))
    resolve()
  })
)

// Vert Drill Duration
export const calcWellVertDrillDurationDefault = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics } = newState, well = wells[wellID]
    let duration = metricsHelper.drill.getVertDrillDuration(metrics.drill, well, newState.selectedStateCode)
    duration = isNumber(duration) ? duration : undefined
    if (duration === well.vertDrillDurationDefault) { resolve(); return }
    dispatcher.batchAction(a_setWellVertDrillDurationDefault(newState, wellID, duration))
    if (isNumber(well.manualDurations[DurationType.VertDrill])) { resolve(); return; }
    dispatcher.dispatchSingle(calcWellVertDrillDuration(wellID)).then(resolve)
  })
)
export const setWellVertDrillDurationManual = (wellID: number, duration: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (duration === well.manualDurations[DurationType.VertDrill]) { resolve(); return }
    // let recalcHorzDur = isNumber(duration) !== isNumber(well.manualDurations[DurationTypes.VertDrill])
    dispatcher.batchAction(a_setWellVertDrillDurationManual(newState, wellID, duration))
    Promise.all([
      dispatcher.dispatchSingle(calcWellVertDrillDuration(wellID)),
      // recalcHorzDur ? dispatcher.dispatchSingle(calcWellHorzDrillDuration(wellID)) : undefined,
    ]).then(resolve)
  })
)
export const calcWellVertDrillDuration = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    let duration = _G.coalesce(well.manualDurations[DurationType.VertDrill], well.vertDrillDurationDefault)
    if (duration === well.vertDrillDuration) { resolve(); return }
    dispatcher.batchAction(a_setWellVertDrillDuration(newState, wellID, duration))
    Promise.all([
      dispatcher.dispatchSingle(calcWellDrillDuration(wellID)),
      dispatcher.dispatchSingle(calcWellVertDrillEnd(wellID)),
    ]).then(resolve)
  })
)

// Horz Drill Duration
export const calcWellHorzDrillDurationDefault = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics } = newState, well = wells[wellID]
    let duration = metricsHelper.drill.getHorzDrillDuration(metrics.drill, well, newState.selectedStateCode)
    duration = isNumber(duration) ? duration : undefined
    if (duration === well.horzDrillDurationDefault) { resolve(); return }
    dispatcher.batchAction(a_setWellHorzDrillDurationDefault(newState, wellID, duration))
    if (isNumber(well.manualDurations[DurationType.HorzDrill])) { resolve(); return; }
    dispatcher.dispatchSingle(calcWellHorzDrillDuration(wellID)).then(resolve)
  })
)
export const setWellHorzDrillDurationManual = (wellID: number, duration: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    if (duration === well.manualDurations[DurationType.HorzDrill]) { resolve(); return }
    // let recalcVertDur = isNumber(duration) !== isNumber(well.manualDurations[DurationTypes.HorzDrill]) 
    dispatcher.batchAction(a_setWellHorzDrillDurationManual(newState, wellID, duration))
    Promise.all([
      dispatcher.dispatchSingle(calcWellHorzDrillDuration(wellID)),
      // recalcVertDur ? dispatcher.dispatchSingle(calcWellVertDrillDuration(wellID)) : undefined,
    ]).then(resolve)
  })
)
export const calcWellHorzDrillDuration = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    let duration =  _G.coalesce(well.manualDurations[DurationType.HorzDrill], well.horzDrillDurationDefault)
    if (duration === well.horzDrillDuration) { resolve(); return }
    dispatcher.batchAction(a_setWellHorzDrillDuration(newState, wellID, duration))
    Promise.all([
      dispatcher.dispatchSingle(calcWellDrillDuration(wellID)),  
      dispatcher.dispatchSingle(calcWellHorzDrillEnd(wellID)),
    ]).then(resolve)    
  })
)
const calcWellDrillDuration = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    let duration = well.vertDrillDuration + well.horzDrillDuration
    duration = isNumber(duration) ? duration : undefined
    if (duration === well.drillDuration) { resolve(); return }
    dispatcher.batchAction(a_setWellDrillDuration(newState, wellID, duration))
    if (!well.padID) { resolve(); return }
    dispatcher.dispatchSingle(calcPadDrillDuration(well.padID)).then(resolve)
  })
)

// Frac Duration
const calcWellFracDuration = (wellID: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let well = newState.wells[wellID]
    let duration = well.fracStages / (well.stagesPerDay === 0 ? undefined : well.stagesPerDay)
    duration = isNumber(duration) ? duration : undefined
    if (duration === well.fracDuration) { resolve(); return }
    dispatcher.batchAction(a_setWellFracDuration(newState, wellID, duration))
    Promise.all([
      well.padID ? dispatcher.dispatchSingle(calcPadFracDurationDefault(well.padID, dispatchTriggers)) : undefined,
      dispatchTriggers ? dispatcher.dispatchSingle(calcWellFracCostDefault(wellID)) : undefined,
    ]).then(resolve)
  })
)

// Drill Out Duration
export const calcWellDrillOutDuration = (wellID: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, metrics } = newState, well = wells[wellID]
    let duration = metrics.drillOut.timing.defDuration
    duration = isNumber(duration) ? duration : undefined
    if (duration === well.horzDrillDuration) { resolve(); return }
    dispatcher.batchAction(a_setWellDrillOutDuration(newState, wellID, duration))
    if (!well.padID) { resolve(); return; }
    dispatcher.dispatchSingle(calcPadDrillOutDurationDefault(well.padID, dispatchTriggers)).then(resolve)
  })
)

const calcWellDrillDatesByPad = (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let drillStart = newState.pads[padID].drillStart
    let wells = Object.values(newState.wells).filter(w => w.padID === padID)
    let i = 1, well: Well, prevWell: Well
    while (i <= wells.length * 2) {
      prevWell = well
      well = wells.find(w => w.vertDrillOrder === i || w.horzDrillOrder === i)
      if (!well)
        break
      let direction = well.vertDrillOrder === i ? 'vert' : 'horz'
      let prevDirection = prevWell && prevWell.horzDrillOrder === i - 1 ? 'horz' : 'vert'
      let startDate = i === 1
        ? drillStart
        : prevDirection === 'vert'
          ? prevWell.vertDrillEnd
          : prevWell.horzDrillEnd
      let endDate = _Date.addDays(startDate, direction === 'vert' ? well.vertDrillDuration : well.horzDrillDuration)
      let startAction = direction === 'vert' ? a_setWellVertDrillStart : a_setWellHorzDrillStart
      let endAction = direction === 'vert' ? a_setWellVertDrillEnd : a_setWellHorzDrillEnd
      if (direction === 'vert') {
        well.vertDrillStart = startDate
        well.vertDrillEnd = endDate
      } else {
        well.horzDrillStart = startDate
        well.horzDrillEnd = endDate
      }
      dispatcher.batchAction(startAction(newState, well.wellID, startDate))
      dispatcher.batchAction(endAction(newState, well.wellID, endDate)) 
      i++
    }

    if (i <= wells.length * 2) {
      for (let w of wells) {
        if (!isNumber(w.vertDrillOrder) || w.vertDrillOrder > i) {
          dispatcher.batchAction(a_setWellVertDrillStart(newState, w.wellID, undefined))
          dispatcher.batchAction(a_setWellVertDrillEnd(newState, w.wellID, undefined))
        }
        if (!isNumber(w.horzDrillOrder) || w.horzDrillOrder > i) {
          dispatcher.batchAction(a_setWellHorzDrillStart(newState, w.wellID, undefined))
          dispatcher.batchAction(a_setWellHorzDrillEnd(newState, w.wellID, undefined))
        }
      }
    }

    resolve()
  })
)

// Vert DrillStart
export const calcWellVertDrillStart = (wellID: number, forceTriggerDispatch: boolean = false) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, pads } = newState, well = wells[wellID]
    let date = undefined
    if (well.padID && well.vertDrillOrder === 1) {
      date = pads[well.padID].drillStart
    } else if (well.padID && well.vertDrillOrder) {
      let prevWell = Object.values(wells).find(w => w.padID === well.padID && (w.vertDrillOrder === well.vertDrillOrder - 1 || w.horzDrillOrder === well.vertDrillOrder - 1))
      if (prevWell) {
        date = (prevWell.vertDrillOrder === well.vertDrillOrder - 1)
          ? prevWell.vertDrillEnd
          : prevWell.horzDrillEnd
      }
    }
    if (!forceTriggerDispatch && _Date.isEqual(date, well.vertDrillStart)) { resolve(); return }
    dispatcher.batchAction(a_setWellVertDrillStart(newState, wellID, date))
    dispatcher.dispatchSingle(calcWellVertDrillEnd(wellID, forceTriggerDispatch)).then(resolve)
  })
)

// Vert Drill End
const calcWellVertDrillEnd = (wellID: number, forceTriggerDispatch: boolean = false) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let wells = newState.wells, well = wells[wellID]
    let date = _Date.addDays(well.vertDrillStart, well.vertDrillDuration)
    if (!forceTriggerDispatch && _Date.isEqual(date, well.vertDrillEnd)) { resolve(); return }   
    dispatcher.batchAction(a_setWellVertDrillEnd(newState, wellID, date))
    if (!well.padID) { resolve(); return }
    let nextWell = Object.values(wells).find(w => w.padID === well.padID && (w.vertDrillOrder === well.vertDrillOrder + 1 || w.horzDrillOrder === well.vertDrillOrder + 1))
    if (!nextWell) { resolve(); return }
    if (nextWell.vertDrillOrder === well.vertDrillOrder + 1) {
      dispatcher.dispatchSingle(calcWellVertDrillStart(nextWell.wellID, forceTriggerDispatch)).then(resolve)
    } else {
      dispatcher.dispatchSingle(calcWellHorzDrillStart(nextWell.wellID, forceTriggerDispatch)).then(resolve)
    }
  })
)

// Horz DrillStart
const calcWellHorzDrillStart = (wellID: number, forceTriggerDispatch: boolean = false) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells } = newState, well = wells[wellID]
    let date = undefined
    if (well.horzDrillOrder) {
      var prevWell = Object.values(wells).find(w => w.padID === well.padID && (w.vertDrillOrder === well.horzDrillOrder - 1 || w.horzDrillOrder === well.horzDrillOrder - 1))
      if (prevWell) {
        date = (prevWell.vertDrillOrder === well.horzDrillOrder - 1)
          ? prevWell.vertDrillEnd
          : prevWell.horzDrillEnd
      }
    }
    if (!forceTriggerDispatch && _Date.isEqual(date, well.horzDrillStart)) { resolve(); return }
    dispatcher.batchAction(a_setWellHorzDrillStart(newState, wellID, date))
    dispatcher.dispatchSingle(calcWellHorzDrillEnd(wellID, forceTriggerDispatch)).then(resolve)
  })
)

// Horz Drill End
const calcWellHorzDrillEnd = (wellID: number, forceTriggerDispatch: boolean = false) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let wells = newState.wells, well = wells[wellID]
    let date = _Date.addDays(well.horzDrillStart, well.horzDrillDuration)
    if (!forceTriggerDispatch && _Date.isEqual(date, well.horzDrillEnd)) { resolve(); return }
    dispatcher.batchAction(a_setWellHorzDrillEnd(newState, wellID, date))
    if (!well.padID) { resolve(); return }
    let nextWell = Object.values(wells).find(w => w.padID === well.padID && (w.vertDrillOrder === well.horzDrillOrder + 1 || w.horzDrillOrder === well.horzDrillOrder + 1))
    if (!nextWell) { resolve(); return }
    else if (nextWell.vertDrillOrder === well.horzDrillOrder + 1) {
      dispatcher.dispatchSingle(calcWellVertDrillStart(nextWell.wellID, forceTriggerDispatch)).then(resolve)
    } else {
      dispatcher.dispatchSingle(calcWellHorzDrillStart(nextWell.wellID, forceTriggerDispatch)).then(resolve)
    }
  })
)

export const setWellVertDrillOrderManual = (wellID: number, drillOrder: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { wells, pads } = newState, well = wells[wellID], origDrillOrder = well.vertDrillOrderManual
    dispatcher.batchAction(a_setWellVertDrillOrderManual(newState, wellID, drillOrder))
    if (!well.padID || !pads[well.padID].batchDrill) { resolve(); return; }

    let actions = []
    actions.push(dispatcher.dispatchSingle(setWellVertDrillOrder(wellID, drillOrder)))
    if (!isNumber(drillOrder)) {
      let nextWell = Object.values(wells).find(w => w.padID === well.padID && (w.vertDrillOrderManual === origDrillOrder + 1 || w.horzDrillOrderManual === origDrillOrder + 1))
      if (nextWell && nextWell.vertDrillOrderManual === origDrillOrder + 1) {
        actions.push(dispatcher.dispatchSingle(calcWellVertDrillStart(nextWell.wellID)))
      } else if (nextWell && nextWell.horzDrillOrderManual === origDrillOrder + 1) {
        actions.push(dispatcher.dispatchSingle(calcWellHorzDrillStart(nextWell.wellID)))
      }
    }
    Promise.all(actions).then(resolve)
  })
)
export const setWellVertDrillOrder = (wellID: number, drillOrder: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (drillOrder === newState.wells[wellID].vertDrillOrder) { resolve(); return }
    dispatcher.batchAction(a_setWellVertDrillOrder(newState, wellID, drillOrder))
    if (!dispatchTriggers) { resolve(); return; }
    dispatcher.dispatchSingle(calcWellVertDrillStart(wellID)).then(resolve)
  })
)

export const setWellHorzDrillOrderManual = (wellID: number, drillOrder: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    
    let { wells, pads } = newState, well = wells[wellID], origDrillOrder = well.horzDrillOrderManual
    dispatcher.batchAction(a_setWellHorzDrillOrderManual(newState, wellID, drillOrder))
    if (!well.padID || !pads[well.padID].batchDrill) { resolve(); return; }

    let actions = []
    actions.push(dispatcher.dispatchSingle(setWellHorzDrillOrder(wellID, drillOrder)))
    if (!isNumber(drillOrder)) {
      let nextWell = Object.values(wells).find(w => w.padID === well.padID && (w.vertDrillOrderManual === origDrillOrder + 1 || w.horzDrillOrderManual === origDrillOrder + 1))
      if (nextWell && nextWell.vertDrillOrderManual === origDrillOrder + 1) {
        actions.push(dispatcher.dispatchSingle(calcWellVertDrillStart(nextWell.wellID)))
      } else if (nextWell && nextWell.horzDrillOrderManual === origDrillOrder + 1) {
        actions.push(dispatcher.dispatchSingle(calcWellHorzDrillStart(nextWell.wellID)))
      }
    }
    Promise.all(actions).then(resolve)
  })
)
export const setWellHorzDrillOrder = (wellID: number, drillOrder: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (drillOrder === newState.wells[wellID].horzDrillOrder) { resolve(); return }
    dispatcher.batchAction(a_setWellHorzDrillOrder(newState, wellID, drillOrder))
    if (!dispatchTriggers) { resolve(); return; }
    dispatcher.dispatchSingle(calcWellHorzDrillStart(wellID)).then(resolve)
  })
)

// ACTIONS
const applyAction = (s: StoreState, action: WellActionTypes) => {
  s.wells = wells_reducer(s.wells, action)
  return action
}

const a_setWells = (s: StoreState, wells: Wells) => applyAction(s, { type: SET_WELLS, payload: wells })
const a_setWellName = (s: StoreState, wellID: number, wellName: string) => applyAction(s, { type: SET_WELL_NAME, payload: { wellID, wellName } })
const a_setWellSurfaceLocation = (s: StoreState, wellID: number, surfaceLocation: number) => applyAction(s, { type: SET_WELL_SURFACE_LOCATION, payload: { wellID, surfaceLocation } })

const a_setWellAvgSpacing = (s: StoreState, wellID: number, avgSpacing: number) => applyAction(s, { type: SET_WELL_AVG_SPACING, payload: { wellID, avgSpacing } })
const a_setWellFracStages = (s: StoreState, wellID: number, fracStages: number) => applyAction(s, { type: SET_WELL_FRAC_STAGES, payload: { wellID, fracStages } })
const a_setWellStagesPerDay = (s: StoreState, wellID: number, stagesPerDay: number) => applyAction(s, { type: SET_WELL_STAGES_PER_DAY, payload: { wellID, stagesPerDay } })
const a_setWellFracDesign = (s: StoreState, wellID: number, fracDesign: string) => applyAction(s, { type: SET_WELL_FRAC_DESIGN, payload: { wellID, fracDesign } })

// Source Data
const a_setGPWellNo = (s: StoreState, wellID: number, gpWellNo: number) => applyAction(s, { type: SET_GP_WELL_NO, payload: { wellID, gpWellNo } })
const a_setWellWI = (s: StoreState, wellID: number, workingInterest: number) => applyAction(s, { type: SET_WELL_WI, payload: { wellID, workingInterest } })
const a_setLateralLength = (s: StoreState, wellID: number, lateralLength: number) => applyAction(s, { type: SET_LATERAL_LENGTH, payload: { wellID, lateralLength } })
const a_setTVD = (s: StoreState, wellID: number, tvd: number) => applyAction(s, { type: SET_TVD, payload: { wellID, tvd } })
const a_setTMD = (s: StoreState, wellID: number, tmd: number) => applyAction(s, { type: SET_TMD, payload: { wellID, tmd } })
const a_setSpacingLeft = (s: StoreState, wellID: number, spacingLeft: number) => applyAction(s, { type: SET_SPACING_LEFT, payload: { wellID, spacingLeft } })
const a_setSpacingRight = (s: StoreState, wellID: number, spacingRight: number) => applyAction(s, { type: SET_SPACING_RIGHT, payload: { wellID, spacingRight } })
const a_setFormation = (s: StoreState, wellID: number, formation: string) => applyAction(s, { type: SET_FORMATION, payload: { wellID, formation } })
const a_setPhaseWindow = (s: StoreState, wellID: number, phaseWindow: string) => applyAction(s, { type: SET_PHASE_WINDOW, payload: { wellID, phaseWindow } })
const a_setDistrictTownship = (s: StoreState, wellID: number, districtTownship: string) => applyAction(s, { type: SET_DISTRICT_TOWNSHIP, payload: { wellID, districtTownship } })
const a_setLateralSite = (s: StoreState, wellID: number, lateralSite: string) => applyAction(s, { type: SET_LATERAL_SITE, payload: { wellID, lateralSite } })
const a_setUnitID = (s: StoreState, wellID: number, unitID: number) => applyAction(s, { type: SET_UNIT_ID, payload: { wellID, unitID } })
const a_setUnit = (s: StoreState, wellID: number, unit: string) => applyAction(s, { type: SET_UNIT, payload: { wellID, unit } })

// Costs
const a_setWellConstructionCost     = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_CONSTRUCTION_COST, payload: { wellID, cost } })
const a_setWellVertDrillCost        = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_VERT_DRILL_COST, payload: { wellID, cost } })
const a_setWellHorzDrillCost        = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_HORZ_DRILL_COST, payload: { wellID, cost } })
const a_setWellDrillRehabCost       = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_DRILL_REHAB_COST, payload: { wellID, cost } })
const a_setWellFracCost             = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_FRAC_COST, payload: { wellID, cost } })
const a_setWellCompletionsRehabCost = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_COMPLETIONS_REHAB_COST, payload: { wellID, cost } })
const a_setWellWaterTransferCost    = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_WATER_TRANSFER_COST, payload: { wellID, cost } })
const a_setWellDrillOutCost         = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_DRILL_OUT_COST, payload: { wellID, cost } })
const a_setWellFacilitiesCost       = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_FACILITIES_COST, payload: { wellID, cost } })
const a_setWellFlowbackCost         = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_FLOWBACK_COST, payload: { wellID, cost } })

const a_setWellConstructionCostDefault     = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_CONSTRUCTION_COST_DEFAULT, payload: { wellID, cost } })
const a_setWellVertDrillCostDefault        = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_VERT_DRILL_COST_DEFAULT, payload: { wellID, cost } })
const a_setWellHorzDrillCostDefault        = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_HORZ_DRILL_COST_DEFAULT, payload: { wellID, cost } })
const a_setWellDrillRehabCostDefault       = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_DRILL_REHAB_COST_DEFAULT, payload: { wellID, cost } })
const a_setWellFracCostDefault             = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_FRAC_COST_DEFAULT, payload: { wellID, cost } })
const a_setWellCompletionsRehabCostDefault = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_COMPLETIONS_REHAB_COST_DEFAULT, payload: { wellID, cost } })
const a_setWellWaterTransferCostDefault    = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_WATER_TRANSFER_COST_DEFAULT, payload: { wellID, cost } })
const a_setWellDrillOutCostDefault         = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_DRILL_OUT_COST_DEFAULT, payload: { wellID, cost } })
const a_setWellFacilitiesCostDefault       = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_FACILITIES_COST_DEFAULT, payload: { wellID, cost } })
const a_setWellFlowbackCostDefault         = (s: StoreState, wellID: number, cost: number) => applyAction(s, { type: SET_WELL_FLOWBACK_COST_DEFAULT, payload: { wellID, cost } })

const a_setWellConstructionAFE     = (s: StoreState, wellID: number, afe: number) => applyAction(s, { type: SET_WELL_CONSTRUCTION_AFE, payload: { wellID, afe } })
const a_setWellVertDrillAFE        = (s: StoreState, wellID: number, afe: number) => applyAction(s, { type: SET_WELL_VERT_DRILL_AFE, payload: { wellID, afe } })
const a_setWellHorzDrillAFE        = (s: StoreState, wellID: number, afe: number) => applyAction(s, { type: SET_WELL_HORZ_DRILL_AFE, payload: { wellID, afe } })
const a_setWellDrillRehabAFE       = (s: StoreState, wellID: number, afe: number) => applyAction(s, { type: SET_WELL_DRILL_REHAB_AFE, payload: { wellID, afe } })
const a_setWellFracAFE             = (s: StoreState, wellID: number, afe: number) => applyAction(s, { type: SET_WELL_FRAC_AFE, payload: { wellID, afe } })
const a_setWellCompletionsRehabAFE = (s: StoreState, wellID: number, afe: number) => applyAction(s, { type: SET_WELL_COMPLETIONS_REHAB_AFE, payload: { wellID, afe } })
const a_setWellWaterTransferAFE    = (s: StoreState, wellID: number, afe: number) => applyAction(s, { type: SET_WELL_WATER_TRANSFER_AFE, payload: { wellID, afe } })
const a_setWellDrillOutAFE         = (s: StoreState, wellID: number, afe: number) => applyAction(s, { type: SET_WELL_DRILL_OUT_AFE, payload: { wellID, afe } })
const a_setWellFacilitiesAFE       = (s: StoreState, wellID: number, afe: number) => applyAction(s, { type: SET_WELL_FACILITIES_AFE, payload: { wellID, afe } })
const a_setWellFlowbackAFE         = (s: StoreState, wellID: number, afe: number) => applyAction(s, { type: SET_WELL_FLOWBACK_AFE, payload: { wellID, afe } })

// Durations
const a_setWellVertDrillDurationDefault = (s: StoreState, wellID: number, duration: number) => applyAction(s, { type: SET_WELL_VERT_DRILL_DURATION_DEFAULT, payload: { wellID, duration } })
const a_setWellVertDrillDurationManual  = (s: StoreState, wellID: number, duration: number) => applyAction(s, { type: SET_WELL_VERT_DRILL_DURATION_MANUAL, payload: { wellID, duration } })
const a_setWellVertDrillDuration        = (s: StoreState, wellID: number, duration: number) => applyAction(s, { type: SET_WELL_VERT_DRILL_DURATION, payload: { wellID, duration } })
const a_setWellHorzDrillDurationDefault = (s: StoreState, wellID: number, duration: number) => applyAction(s, { type: SET_WELL_HORZ_DRILL_DURATION_DEFAULT, payload: { wellID, duration } })
const a_setWellHorzDrillDurationManual  = (s: StoreState, wellID: number, duration: number) => applyAction(s, { type: SET_WELL_HORZ_DRILL_DURATION_MANUAL, payload: { wellID, duration } })
const a_setWellHorzDrillDuration        = (s: StoreState, wellID: number, duration: number) => applyAction(s, { type: SET_WELL_HORZ_DRILL_DURATION, payload: { wellID, duration } })
const a_setWellDrillDuration            = (s: StoreState, wellID: number, duration: number) => applyAction(s, { type: SET_WELL_DRILL_DURATION, payload: { wellID, duration } })
const a_setWellFracDuration             = (s: StoreState, wellID: number, duration: number) => applyAction(s, { type: SET_WELL_FRAC_DURATION, payload: { wellID, duration } })
const a_setWellDrillOutDuration         = (s: StoreState, wellID: number, duration: number) => applyAction(s, { type: SET_WELL_DRILL_OUT_DURATION, payload: { wellID, duration } })

// Dates
const a_setWellConstructionStart = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_CONSTRUCTION_START, payload: { wellID, date } })
const a_setWellConstructionEnd   = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_CONSTRUCTION_END, payload: { wellID, date } })
const a_setWellVertDrillStart    = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_VERT_DRILL_START, payload: { wellID, date } })
const a_setWellVertDrillEnd      = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_VERT_DRILL_END, payload: { wellID, date } })
const a_setWellHorzDrillStart    = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_HORZ_DRILL_START, payload: { wellID, date } })
const a_setWellHorzDrillEnd      = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_HORZ_DRILL_END, payload: { wellID, date } })
const a_setWellFracStart         = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_FRAC_START, payload: { wellID, date } })
const a_setWellFracEnd           = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_FRAC_END, payload: { wellID, date } })
const a_setWellDrillOutStart     = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_DRILL_OUT_START, payload: { wellID, date } })
const a_setWellDrillOutEnd       = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_DRILL_OUT_END, payload: { wellID, date } })
const a_setWellFacilitiesStart   = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_FACILITIES_START, payload: { wellID, date } })
const a_setWellFacilitiesEnd     = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_FACILITIES_END, payload: { wellID, date } })
const a_setWellTIL               = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_TIL, payload: { wellID, date } })
const a_setWellFirstFlow         = (s: StoreState, wellID: number, date: string) => applyAction(s, { type: SET_WELL_FIRST_FLOW, payload: { wellID, date } })

const a_setWellPadID = (s: StoreState, wellID: number, padID: number) => applyAction(s, { type: SET_WELL_PADID, payload: { wellID, padID } })

// Drill Orders
const a_setWellPredecessor = (s: StoreState, wellID: number, predecessorWellID: number) => applyAction(s, { type: SET_WELL_PREDECESSOR, payload: { wellID, predecessorWellID } })
const a_setWellVertDrillOrderDefault = (s: StoreState, wellID: number, drillOrder: number) => applyAction(s, { type: SET_WELL_VERT_DRILL_ORDER_DEFAULT, payload: { wellID, drillOrder } })
const a_setWellVertDrillOrderManual = (s: StoreState, wellID: number, drillOrder: number) => applyAction(s, { type: SET_WELL_VERT_DRILL_ORDER_MANUAL, payload: { wellID, drillOrder } })
const a_setWellVertDrillOrder = (s: StoreState, wellID: number, drillOrder: number) => applyAction(s, { type: SET_WELL_VERT_DRILL_ORDER, payload: { wellID, drillOrder } })

const a_setWellHorzDrillOrderDefault = (s: StoreState, wellID: number, drillOrder: number) => applyAction(s, { type: SET_WELL_HORZ_DRILL_ORDER_DEFAULT, payload: { wellID, drillOrder } })
const a_setWellHorzDrillOrderManual = (s: StoreState, wellID: number, drillOrder: number) => applyAction(s, { type: SET_WELL_HORZ_DRILL_ORDER_MANUAL, payload: { wellID, drillOrder } })
const a_setWellHorzDrillOrder = (s: StoreState, wellID: number, drillOrder: number) => applyAction(s, { type: SET_WELL_HORZ_DRILL_ORDER, payload: { wellID, drillOrder } })

// Functions
const getWellOrderNum_R = (well: Well, wellsArray: Well[], count = 1) => {
  if (!well.predecessorWellID) { return count }
  return getWellOrderNum_R(wellsArray.find(w => w.wellID === well.predecessorWellID), wellsArray, count + 1)
}

const hasDrillAFE = (afes: PartialRecord<AFEType, number>) => {
  return isNumber(afes[AFEType.Construction])
    || isNumber(afes[AFEType.VertDrill])
    || isNumber(afes[AFEType.HorzDrill])
    || isNumber(afes[AFEType.DrillRehab])
}

const hasCompletionsAFE = (afes: PartialRecord<AFEType, number>) => {
  return isNumber(afes[AFEType.Frac])
    || isNumber(afes[AFEType.CompletionsRehab])
    || isNumber(afes[AFEType.WaterTransfer])
    || isNumber(afes[AFEType.DrillOut])
    || isNumber(afes[AFEType.Facilities])
    || isNumber(afes[AFEType.Flowback])
}


const isWinterMonth = (date: string) => {
  if (!date) { return false }
  return [0,1,11].includes(new Date(date).getMonth()) // Jan,Feb,Dec
}