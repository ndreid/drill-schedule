import { SET_PAD_CONSTRUCTION_START,            SET_PAD_CONSTRUCTION_END,             SET_PAD_DRILL_START,                        SET_PAD_DRILL_END,
         SET_PAD_FRAC_START,                    SET_PAD_FRAC_END,                     SET_PAD_DRILL_OUT_START,             SET_PAD_DRILL_OUT_END,
         SET_PAD_FACILITIES_START,              SET_PAD_FACILITIES_END,               SET_PAD_TIL,                         SET_PAD_FIRST_FLOW,
         SET_PAD_CONSTRUCTION_START_DEFAULT,    SET_PAD_DRILL_START_DEFAULT,                 SET_PAD_FRAC_START_DEFAULT,          SET_PAD_DRILL_OUT_START_DEFAULT,
         SET_PAD_FACILITIES_START_DEFAULT,      SET_PAD_CONSTRUCTION_START_MANUAL,    SET_PAD_DRILL_START_MANUAL,                 SET_PAD_FRAC_START_MANUAL,
         SET_PAD_DRILL_OUT_START_MANUAL,        SET_PAD_FACILITIES_START_MANUAL,       
         SET_PAD_PREDECESSOR,                   SET_PAD_SUCCESSOR,                    SET_PAD_CREW,  
         SET_PAD_CONSTRUCTION_COST,             SET_PAD_VERT_DRILL_COST,           SET_PAD_HORZ_DRILL_COST,          SET_PAD_FRAC_COST,
         SET_PAD_DRILL_OUT_COST,                SET_PAD_FACILITIES_COST,              SET_PAD_FLOWBACK_COST,  
         SET_PAD_CONSTRUCTION_DURATION,         SET_PAD_DRILL_DURATION,               SET_PAD_FRAC_DURATION,               SET_PAD_DRILL_OUT_DURATION,
         SET_PAD_FACILITIES_DURATION,    
         SET_PAD_WORKING_INTEREST,              SET_PADS,
         SET_PAD_CONSTRUCTION_DURATION_DEFAULT, SET_PAD_CONSTRUCTION_DURATION_MANUAL, SET_PAD_FRAC_DURATION_DEFAULT,
         SET_PAD_DRILL_OUT_DURATION_DEFAULT,    SET_PAD_DRILL_OUT_DURATION_MANUAL,    SET_PAD_FACILITIES_DURATION_DEFAULT,
         SET_PAD_FACILITIES_DURATION_MANUAL,    SET_PAD_FRAC_DURATION_MANUAL,         SET_BATCH_DRILL_FLAG,
         SET_WELL_COUNT,                        SET_PAD_DRILL_DELAY_MANUAL,           SET_PAD_FRAC_DELAY_MANUAL,           SET_PAD_DRILL_OUT_DELAY_MANUAL,
         SET_PAD_FACILITIES_DELAY_MANUAL,       SET_PAD_DRILL_REHAB_COST,          SET_PAD_COMPLETIONS_REHAB_COST,      SET_PAD_WATER_TRANSFER_COST, SET_PAD_IS_SCHEDULED, SPLIT_PAD, UNSPLIT_PAD, CREATE_TEMP_PAD, DELETE_TEMP_PAD, SET_PAD_NAME
} from '../action-types/pad-action-types'
import { pads as pads_reducer } from '../reducers/pads-reducer'
import { calcWellStagesPerDay, calcWellVertDrillStart, calcWellVertDrillDurationDefault, calcWellHorzDrillDurationDefault, calcWellFracStages, calcWellDrillOutDuration, setWellVertDrillOrder, setWellHorzDrillOrder, calcWellAvgSpacing,
  calcWellConstructionCostDefault, calcWellVertDrillCostDefault, calcWellHorzDrillCostDefault, calcWellFracCostDefault, calcWellDrillOutCostDefault, calcWellFacilitiesCostDefault, calcWellFlowbackCostDefault, moveWell, calcWellName
} from './well-actions'
import { sqlService } from '../../services'
import { _Date } from 'data-type-ext'
import { isNumber } from 'data-type-ext/_Number'
import metricsHelper from '../../helpers/metrics-helper';
import { StoreState, ScheduleType, Pad, Pads, ScheduleMetricsBase, PartialRecord } from '../../types';
import { Dispatcher } from '../middleware/batched-thunk';
import { ScheduleTypeMap } from '../../models';

export const loadPads = (opsScheduleID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    Promise.all([
      sqlService.getPads(opsScheduleID),
      sqlService.getPadOverrides(opsScheduleID),
      sqlService.getPadCrews(opsScheduleID),
      sqlService.getPadPredecessors(opsScheduleID),
    ]).then(([padModels, padOverrideModels, padCrewModels, padPredecessorModels]) => {
      let pads = padModels.reduce<Record<number, Pad>>((padsObj, model) => {
        let overrides = padOverrideModels.filter(o => o.padID === model.padID).reduce((obj, oModel) => {
          let scheduleType = ScheduleTypeMap[oModel.scheduleTypeID]
          obj.manualDates[scheduleType] = oModel.startDate
          obj.manualDurations[scheduleType] = oModel.duration
          obj.manualDelays[scheduleType] = oModel.delay
          return obj
        }, { manualDates: {}, manualDurations: {}, manualDelays: {} })
        let crews = padCrewModels.filter(c => c.padID === model.padID).reduce<PartialRecord<ScheduleType, number>>((obj, cModel) => {
          obj[ScheduleTypeMap[cModel.scheduleTypeID]] = cModel.crewID
          return obj
        }, {})
        let predecessors = padPredecessorModels.filter(pp => pp.padID === model.padID).reduce<PartialRecord<ScheduleType, number>>((obj, ppModel) => {
          obj[ScheduleTypeMap[ppModel.scheduleTypeID]] = ppModel.predecessorPadID
          return obj
        }, {})
        let successors = padPredecessorModels.filter(pp => pp.predecessorPadID === model.padID).reduce<PartialRecord<ScheduleType, number>>((obj, ppModel) => {
          obj[ScheduleTypeMap[ppModel.scheduleTypeID]] = ppModel.padID
          return obj
        }, {})
        let pad = {
          ...model,
          ...overrides,
          crews,
          predecessors,
          successors,
        }
        padsObj[pad.padID] = pad
        return padsObj
      }, {})
      dispatcher.batchAction(a_setPads(newState, pads))
      resolve()
    })
  })
)

export const createTempPad = (wellID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let actions = []
    let pads = Object.values(newState.pads)
    let well = newState.wells[wellID]
    if (newState.selectedStateCode !== 'OH')
      throw Error('Not configured to create Temp Pad for State ' + newState.selectedStateCode)
    if (newState.selectedStateCode === 'OH' && !well.unit)
      throw Error(`Failed to create temp Pad for WellID ${wellID}. Unit name was blank.`)
    let tempPadName = `${well.unit} UNIT`
    let padID, predecessorWellID
    if (pads.some(p => p.padName === tempPadName)) {
      padID = pads.find(p => p.padName === tempPadName).padID
      let wells = Object.values(newState.wells).filter(w => w.padID === padID)
      let predecessorIDs = wells.map(w => w.predecessorWellID)
      predecessorWellID = wells.map(w => w.wellID).find(id => !predecessorIDs.includes(id))
      if (predecessorWellID === wellID) {
        resolve(); return
      }
      if (!isNumber(predecessorWellID))
        throw Error(`Failed to assign WellID ${wellID} to PadID ${padID}. Could not locate Well without successor.`)
    } else {
      actions.push(sqlService.getNextPadID().then(newPadID => {
        console.log('newPadID', newPadID)
        padID = newPadID
        dispatcher.batchAction(a_createTempPad(newState, newPadID, tempPadName))
      }))
    }
    Promise.all(actions).then(() => {
      console.log('moving well')
      dispatcher.dispatchSingle(moveWell(wellID, predecessorWellID, padID)).then(resolve)
    })
  })
)

export const deleteTempPad = (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    Promise.all([pad.isScheduled ? dispatcher.dispatchSingle(setIsScheduled(padID, false)) : undefined]).then(() => {
      dispatcher.batchAction(a_deleteTempPad(newState, padID))
      resolve()
    })
  })
)

export const movePad = (scheduleType: ScheduleType, movedPadID: number, targetPadID: number, crewID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise ((resolve, reject) => {
    console.log(scheduleType, movedPadID, targetPadID, crewID)
    if (movedPadID === targetPadID) { resolve(); return; }

    let { pads, crews } = newState

    let movedPad = pads[movedPadID]
    if (crewID === 0) { crewID = undefined }
    if (movedPad.crews[scheduleType] == crewID && !targetPadID && !movedPad.predecessors[scheduleType]) { resolve(); return; } // eslint-disable-line

    // targetPadID is for the Pad above where the Pad was moved
    let targetPad = targetPadID ? pads[targetPadID] : undefined

    let movedPredPadID = movedPad.predecessors[scheduleType]
    let movedSuccPadID = movedPad.successors[scheduleType]
    let targetSuccPadID 
    if (targetPad) {
      targetSuccPadID = targetPad.successors[scheduleType]
    } else if (crewID) {
      let padsWOPredecessors = Object.values(pads).filter(p =>
        p.crews[scheduleType] === crewID
        && !p.predecessors[scheduleType]
      )

      if (padsWOPredecessors.length > 1) {
        let crewName = crews[scheduleType][crewID]
        throw new Error("Found " + padsWOPredecessors.length + " Pads without Predecessors on the " + scheduleType + " schedule on Crew '" + crewName + "'.")
      }
      
      if (padsWOPredecessors.length === 1)
        targetSuccPadID = padsWOPredecessors[0].padID
    }
    console.log('tgtSuccPadID', targetSuccPadID, movedPredPadID, movedSuccPadID)

    // Moved Pad
    dispatcher.batchAction(a_setPadPredecessor(newState, movedPadID, scheduleType, targetPadID))
    dispatcher.batchAction(a_setPadSuccessor(newState, movedPadID, scheduleType, targetSuccPadID))
    dispatcher.batchAction(a_setPadCrew(newState, movedPadID, scheduleType, crewID))

    // Target Pad
    if (targetPadID) {
      dispatcher.batchAction(a_setPadSuccessor(newState, targetPadID, scheduleType, movedPadID))
    }

    // Moved Predecessor Pad
    if (movedPredPadID) {
      dispatcher.batchAction(a_setPadSuccessor(newState, movedPredPadID, scheduleType, movedSuccPadID))
    }

    // Moved Successor Pad
    if (movedSuccPadID) {
      dispatcher.batchAction(a_setPadPredecessor(newState, movedSuccPadID, scheduleType, movedPredPadID))
    }

    // Target Successor Pad
    if (targetSuccPadID) {
      dispatcher.batchAction(a_setPadPredecessor(newState, targetSuccPadID, scheduleType, movedPadID))
    }

    Promise.all([
      dispatcher.dispatchSingle(getCalcScheduleStartDateAction(scheduleType)(movedPadID)),
      (movedPad.manualDates[scheduleType] && targetSuccPadID) ? dispatcher.dispatchSingle(getCalcScheduleStartDateAction(scheduleType)(targetSuccPadID)) : undefined,
      movedSuccPadID ? dispatcher.dispatchSingle(getCalcScheduleStartDateAction(scheduleType)(movedSuccPadID)) : undefined,
    ]).then(() => {console.log('resolved'); resolve()})
  }) 
)

export const splitPad = (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (Math.max(...Object.values(newState.pads)
      .filter(p => p.gisPadID === newState.pads[padID].gisPadID)
      .map(p => p.activityCode)) >= 9) {
        resolve()
        return
    }
    dispatcher.batchAction(a_splitPad(newState, padID))
    resolve()
  })
)

export const unsplitPad = (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    Promise.all(Object.keys(newState.pads[padID].crews).map((s: ScheduleType) => 
      dispatcher.dispatchSingle(movePad(s, padID, undefined, undefined))
    )).then(() => {
      dispatcher.batchAction(a_unsplitPad(newState, padID))
      resolve()
    })
  })
)

export const setPadName = (padID: number, padName: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setPadName(newState, padID, padName))
    dispatcher.dispatchMany(Object.values(newState.wells).filter(w => w.padID === padID).map(w => calcWellName(w.wellID))).then(resolve)
  })
)

/**********
** DATES **
**********/
export const calcAllPadScheduleDates = (scheduleType: ScheduleType) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let action = getCalcScheduleStartDateAction(scheduleType)
    Promise.all([
      Object.keys(newState.pads).map(padID => dispatcher.dispatchSingle(action(+padID)))
    ]).then(resolve)
  })
)

// Construction Start
export const calcPadConstructionStartDefault = (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, metrics } = newState, pad = pads[padID], scheduleMetrics = metrics.construction
    let date = _Date.addDays(pad.drillStart, scheduleMetrics.timing.defConstructionBeforeRigSpud)
    if (_Date.isEqual(date, pad.constructionStartDefault)) { resolve(); return }
    dispatcher.batchAction(a_setPadConstructionStartDefault(newState, padID, date))

    if (pad.manualDates[ScheduleType.Construction]) { resolve(); return }
    dispatcher.dispatchSingle(setPadConstructionStart(padID, date)).then(resolve)
  })
)
export const setPadConstructionStartManual = (padID: number, date: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    if (_Date.isEqual(date, pad.manualDates[ScheduleType.Construction])) { resolve(); return; }
    dispatcher.batchAction(a_setPadConstructionStartManual(newState, padID, date))
    let startDate = date || pad.constructionStartDefault
    dispatcher.dispatchSingle(setPadConstructionStart(padID, startDate)).then(resolve)
  })
)
export const setPadConstructionStart = (padID: number, date: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (_Date.isEqual(date, newState.pads[padID].constructionStart)) { resolve(); return }
    dispatcher.batchAction(a_setPadConstructionStart(newState, padID, date))
    dispatcher.dispatchSingle(calcPadConstructionEnd(padID)).then(resolve)
  })
)

// Construction End
const calcPadConstructionEnd = (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    let date = _Date.addDays(pad.constructionStart, pad.constructionDuration)
    if (_Date.isEqual(date, pad.constructionEnd)) { resolve(); return }
    dispatcher.batchAction(a_setPadConstructionEnd(newState, padID, date))
    resolve()
  })
)

// Drill Start
export const calcPadDrillStartDefault = (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, metrics } = newState, pad = pads[padID], scheduleMetrics = metrics.drill
    let date = calcStartDateDefault(pad, pads, ScheduleType.Drill, scheduleMetrics, 'drillEnd')
    if (_Date.isEqual(date, pad.drillStartDefault)) { resolve(); return }
    dispatcher.batchAction(a_setPadDrillStartDefault(newState, padID, date))

    if (pad.manualDates[ScheduleType.Drill]) { resolve(); return; }
    dispatcher.dispatchSingle(setPadDrillStart(padID, date)).then(resolve)
  })
)
export const setPadDrillStartManual = (padID: number, date: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    if (_Date.isEqual(date, pad.manualDates[ScheduleType.Drill])) { resolve(); return; }
    dispatcher.batchAction(a_setPadDrillStartManual(newState, padID, date))
    let startDate = date || pad.drillStartDefault
    dispatcher.dispatchSingle(setPadDrillStart(padID, startDate)).then(resolve)
  })
)
export const setPadDrillStart = (padID: number, date: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (_Date.isEqual(date, newState.pads[padID].drillStart)) { resolve(); return }
    dispatcher.batchAction(a_setPadDrillStart(newState, padID, date))
    let firstWell = Object.values(newState.wells).find(w => w.padID === padID && w.vertDrillOrder === 1)
    Promise.all([
      dispatcher.dispatchSingle(calcPadConstructionStartDefault(padID)),
      dispatcher.dispatchSingle(calcPadDrillEnd(padID)),
      firstWell ? dispatcher.dispatchSingle(calcWellVertDrillStart(firstWell.wellID)) : undefined,
    ]).then(resolve)
  })
)

// Drill End
const calcPadDrillEnd = (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    let date = _Date.addDays(pad.drillStart, pad.drillDuration)
    if (_Date.isEqual(date, pad.drillEnd)) { resolve(); return }
    dispatcher.batchAction(a_setPadDrillEnd(newState, padID, date))
    Promise.all([
      dispatcher.dispatchSingle(calcPadFracStartDefault(padID)),
      pad.successors[ScheduleType.Drill] ? dispatcher.dispatchSingle(calcPadDrillStartDefault(pad.successors[ScheduleType.Drill])) : undefined
    ]).then(resolve)
  })
)

// Frac Start
export const calcPadFracStartDefault = (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, metrics } = newState, pad = pads[padID], scheduleMetrics = metrics.frac
    let date = calcStartDateDefault(pad, pads, ScheduleType.Frac, scheduleMetrics, 'fracEnd')
      || _Date.addDays(pad.drillEnd, scheduleMetrics.timing.defDrillToFrac || 0)
    if (_Date.isEqual(date, pad.fracStartDefault)) { resolve(); return }
    dispatcher.batchAction(a_setPadFracStartDefault(newState, padID, date))

    if (pad.manualDates[ScheduleType.Frac]) { resolve(); return; }
    dispatcher.dispatchSingle(setPadFracStart(padID, date)).then(resolve)
  })
)
export const setPadFracStartManual = (padID: number, date: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    if (_Date.isEqual(date, pad.manualDates[ScheduleType.Frac])) { resolve(); return; }
    dispatcher.batchAction(a_setPadFracStartManual(newState, padID, date))
    let startDate = date || pad.fracStartDefault
    dispatcher.dispatchSingle(setPadFracStart(padID, startDate)).then(resolve)
  })
)
export const setPadFracStart = (padID: number, date: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    if (_Date.isEqual(date, pad.fracStart)) { resolve(); return; }
    let currentFracStart = pad.fracStart
    dispatcher.batchAction(a_setPadFracStart(newState, padID, date))

    if (isWinterMonth(date) === isWinterMonth(currentFracStart)) {
      dispatcher.dispatchSingle(calcPadFracEnd(padID)).then(resolve)
    } else {
      Promise.all([
        ...Object.values(newState.wells).map(w => w.padID === padID ? dispatcher.dispatchSingle(calcWellStagesPerDay(w.wellID)) : undefined),
        !isNaN(pad.manualDurations[ScheduleType.Frac]) ? dispatcher.dispatchSingle(calcPadFracEnd(padID)) : undefined
      ]).then(() => {
        resolve()
      })
    }
  })
)

// Frac End
export const calcPadFracEnd = (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    let date = _Date.addDays(pad.fracStart, pad.fracDuration)
    if (_Date.isEqual(date, pad.fracEnd)) { resolve(); return }
    dispatcher.batchAction(a_setPadFracEnd(newState, padID, date))
    Promise.all([
      dispatcher.dispatchSingle(calcPadDrillOutStartDefault(padID)),
      pad.successors[ScheduleType.Frac] ? dispatcher.dispatchSingle(calcPadFracStartDefault(pad.successors[ScheduleType.Frac])) : undefined
    ]).then(resolve)
  })
)

// Drill Out Start
export const calcPadDrillOutStartDefault = (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, metrics } = newState, pad = pads[padID], scheduleMetrics = metrics.drillOut
    let date = calcStartDateDefault(pad, pads, ScheduleType.DrillOut, scheduleMetrics, 'drillOutEnd')
      || _Date.addDays(pad.fracEnd, scheduleMetrics.timing.defFracToDrillOut || 0)
    if (_Date.isEqual(date, pad.drillOutStartDefault)) { resolve(); return }
    dispatcher.batchAction(a_setPadDrillOutStartDefault(newState, padID, date))
    
    if (pad.manualDates[ScheduleType.DrillOut]) { resolve(); return }
    dispatcher.dispatchSingle(setPadDrillOutStart(padID, date)).then(resolve)
  })
)
export const setPadDrillOutStartManual = (padID: number, date: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    if (_Date.isEqual(date, pad.manualDates[ScheduleType.DrillOut])) { resolve(); return }
    dispatcher.batchAction(a_setPadDrillOutStartManual(newState, padID, date))
    let startDate = date || pad.drillOutStartDefault
    dispatcher.dispatchSingle(setPadDrillOutStart(padID, startDate)).then(resolve)
  })
)
export const setPadDrillOutStart = (padID: number, date: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (_Date.isEqual(date, newState.pads[padID].drillOutStart)) { resolve(); return }
    dispatcher.batchAction(a_setPadDrillOutStart(newState, padID, date))
    dispatcher.dispatchSingle(calcPadDrillOutEnd(padID)).then(resolve)
  })
)

// Drill Out End
const calcPadDrillOutEnd= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    let date = _Date.addDays(pad.drillOutStart, pad.drillOutDuration)
    if (_Date.isEqual(date, pad.drillOutEnd)) { resolve(); return }
    dispatcher.batchAction(a_setPadDrillOutEnd(newState, padID, date))
    Promise.all([
      dispatcher.dispatchSingle(calcPadFacilitiesStartDefault(padID)),
      pad.successors[ScheduleType.DrillOut] ? dispatcher.dispatchSingle(calcPadDrillOutStartDefault(pad.successors[ScheduleType.DrillOut])) : undefined
    ]).then(resolve)
  })
)

// Facilities Start
export const calcPadFacilitiesStartDefault= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, metrics } = newState, pad = pads[padID], scheduleMetrics = metrics.facilities
    let date = calcStartDateDefault(pad, pads, ScheduleType.Facilities, scheduleMetrics, 'facilitiesEnd')
      || _Date.addDays(pad.drillOutEnd, scheduleMetrics.timing.defDrillOutToFacilities || 0)
    if (_Date.isEqual(date, pad.facilitiesStartDefault)) { resolve(); return }
    dispatcher.batchAction(a_setPadFacilitiesStartDefault(newState, padID, date))
    
    if (pad.manualDates[ScheduleType.Facilities]) { resolve(); return }
    dispatcher.dispatchSingle(setPadFacilitiesStart(padID, date)).then(resolve)
  })
)
export const setPadFacilitiesStartManual = (padID: number, date: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => { 
    let pad = newState.pads[padID]
    if (_Date.isEqual(date, pad.manualDates[ScheduleType.Facilities])) { resolve(); return }
    dispatcher.batchAction(a_setPadFacilitiesStartManual(newState, padID, date))
    let startDate = date || pad.facilitiesStartDefault
    dispatcher.dispatchSingle(setPadFacilitiesStart(padID, startDate)).then(resolve)
  })
)
export const setPadFacilitiesStart = (padID: number, date: string) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (_Date.isEqual(date, newState.pads[padID].facilitiesStart)) { resolve(); return }
    dispatcher.batchAction(a_setPadFacilitiesStart(newState, padID, date))
    dispatcher.dispatchSingle(calcPadFacilitiesEnd(padID)).then(resolve)
  })
)

// Facilities End
const calcPadFacilitiesEnd= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    let date = _Date.addDays(pad.facilitiesStart, pad.facilitiesDuration)
    if (_Date.isEqual(date, pad.facilitiesEnd)) { resolve(); return }
    dispatcher.batchAction(a_setPadFacilitiesEnd(newState, padID, date))
    Promise.all([
      dispatcher.dispatchSingle(calcPadFirstFlow(padID)),
      pad.successors[ScheduleType.Facilities] ? dispatcher.dispatchSingle(calcPadFacilitiesStartDefault(pad.successors[ScheduleType.Facilities])) : undefined
    ]).then(resolve)
  })
)

// TIL
export const calcPadTIL = (padID: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    if (!pad.manualDates[ScheduleType.Flowback]) { resolve(); return; }
    dispatcher.dispatchSingle(setPadTIL(padID, pad.manualDates[ScheduleType.Flowback], dispatchTriggers)).then(resolve)
  })
)
export const setPadTIL = (padID: number, date: string, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (_Date.isEqual(date, newState.pads[padID].til)) { resolve(); return; }
    dispatcher.batchAction(a_setPadTIL(newState, padID, date))
    if (!dispatchTriggers) { resolve(); return; }
    dispatcher.dispatchSingle(calcPadFirstFlow(padID)).then(resolve)
  })
)

// First Flow
const calcPadFirstFlow= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    let date = (pad.til && (!pad.facilitiesEnd || _Date.isBefore(pad.facilitiesEnd, pad.til))) ? pad.til : pad.facilitiesEnd
    if (_Date.isEqual(date, pad.firstFlow)) { resolve(); return }
    dispatcher.batchAction(a_setPadFirstFlow(newState, padID, date))
    resolve()
  })
)

export const setPadManualStartDate = (padID: number, scheduleType: ScheduleType, date: string) => dispatcher => (
  new Promise((resolve, reject) => {
    let action
    switch (scheduleType) {
      case ScheduleType.Construction: action = setPadConstructionStartManual; break
      case ScheduleType.Drill: action = setPadDrillStartManual; break
      case ScheduleType.Frac: action = setPadFracStartManual; break
      case ScheduleType.DrillOut: action = setPadDrillOutStartManual; break
      case ScheduleType.Facilities: action = setPadFacilitiesStartManual; break
      case ScheduleType.Flowback: action = setPadTIL; break
      default: throw Error('pad-actions.js setPadManualStartDate() is not configured to handle ScheduleType ' + scheduleType)
    }
    dispatcher.dispatchSingle(action(padID, date)).then(resolve())
  })
)

/**********
** COSTS **
**********/

export const calcPadConstructionCost= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, metrics } = newState, pad = pads[padID], constructionMetrics = metrics.construction
    let cost = constructionMetrics.costs.initialCost.padCost + constructionMetrics.costs.initialCost.roadCost
    cost = isNumber(cost) ? cost : undefined
    if (cost === pad.constructionCost) { resolve(); return }
    dispatcher.batchAction(a_setPadConstructionCost(newState, padID, cost))
    resolve()
  })
)
export const calcPadVertDrillCost= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, wells } = newState, pad = pads[padID]
    let cost = 0
    for (let well of Object.values(wells).filter(w => w.padID === padID)) {
      cost += well.vertDrillCost
    }
    cost = isNumber(cost) ? cost : undefined
    if (cost === pad.vertDrillCost) { resolve(); return }
    dispatcher.batchAction(a_setPadVertDrillCost(newState, padID, cost))
    resolve()
  })
)
export const calcPadHorzDrillCost= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, wells } = newState, pad = pads[padID]
    let cost = 0
    for (let well of Object.values(wells).filter(w => w.padID === padID)) {
      cost += well.horzDrillCost
    }
    cost = isNumber(cost) ? cost : undefined
    if (cost === pad.horzDrillCost) { resolve(); return }
    dispatcher.batchAction(a_setPadHorzDrillCost(newState, padID, cost))
    resolve()
  })
)
export const calcPadDrillRehabCost= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, metrics } = newState, pad = pads[padID], constructionMetrics = metrics.construction
    let cost = constructionMetrics.costs.drillRehabCost.padRehabCost + constructionMetrics.costs.drillRehabCost.roadRehabCost
    cost = isNumber(cost) ? cost : undefined
    if (cost === pad.drillRehabCost) { resolve(); return }
    dispatcher.batchAction(a_setPadDrillRehabCost(newState, padID, cost))
    resolve()
  })
)
export const calcPadFracCost= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, wells } = newState, pad = pads[padID]
    let cost = 0
    for (let well of Object.values(wells).filter(w => w.padID === padID)) {
      cost += well.fracCost
    }
    cost = isNumber(cost) ? cost : undefined
    if (cost === pad.fracCost) { resolve(); return }
    dispatcher.batchAction(a_setPadFracCost(newState, padID, cost))
    resolve()
  })
)
export const calcPadCompletionsRehabCost= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, metrics } = newState, pad = pads[padID], scheduleMetrics = metrics.construction
    let cost = scheduleMetrics.costs.completionsRehabCost.padRehabCost + scheduleMetrics.costs.completionsRehabCost.roadRehabCost
    cost = isNumber(cost) ? cost : undefined
    if (cost === pad.completionsRehabCost) { resolve(); return }
    dispatcher.batchAction(a_setPadCompletionsRehabCost(newState, padID, cost))
    resolve()
  })
)
export const calcPadWaterTransferCost= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, metrics } = newState, pad = pads[padID], scheduleMetrics = metrics.construction
    let cost = scheduleMetrics.costs.waterTransferCost
    cost = isNumber(cost) ? cost : undefined
    if (cost === pad.waterTransferCost) { resolve(); return }
    dispatcher.batchAction(a_setPadWaterTransferCost(newState, padID, cost))
    resolve()
  })
)
export const calcPadDrillOutCost= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, wells } = newState, pad = pads[padID]
    let cost = 0
    for (let well of Object.values(wells).filter(w => w.padID === padID)) {
      cost += well.drillOutCost
    }
    cost = isNumber(cost) ? cost : undefined
    if (cost === pad.drillOutCost) { resolve(); return }
    dispatcher.batchAction(a_setPadDrillOutCost(newState, padID, cost))
    resolve()
  })
)
export const calcPadFacilitiesCost= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, wells, metrics } = newState, pad = pads[padID]
    let cost = 0
    for (let well of Object.values(wells).filter(w => w.padID === padID)) {
      cost += metricsHelper.facilities.getCosts(metrics.facilities, pad.wellCount, well.phaseWindow)
    }
    cost = isNumber(cost) ? cost : undefined
    if (cost === pad.facilitiesCost) { resolve(); return }
    dispatcher.batchAction(a_setPadFacilitiesCost(newState, padID, cost))
    resolve()
  })
)
export const calcPadFlowbackCost= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, metrics } = newState, pad = pads[padID]
    let cost = metrics.flowback.costs.fixedCosts * pad.wellCount
    cost = isNumber(cost) ? cost : undefined
    if (cost === pad.flowbackCost) { resolve(); return }
    dispatcher.batchAction(a_setPadFlowbackCost(newState, padID, cost))
    resolve()
  })
)

export const calcPadWorkingInterest= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, wells } = newState, pad = pads[padID]
    let padWells = Object.values(wells).filter(w => w.padID === pad.padID)
    let workingInterest = (padWells.reduce(((wi, w) => wi + (w.padID === padID ? w.workingInterest : 0)), 0) / padWells.length)
    workingInterest = isNumber(workingInterest) ? workingInterest : undefined
    if (workingInterest === pad.workingInterest) { resolve(); return }
    dispatcher.batchAction(a_setPadWorkingInterest(newState, padID, workingInterest))
    resolve()
  })
)

// Durations

export const calcAllScheduleDurations = (scheduleType: ScheduleType) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    Promise.all((() => {
      switch (scheduleType) {
        case ScheduleType.Construction:
          return Object.keys(newState.pads).map(padID => dispatcher.dispatchSingle(calcPadConstructionDurationDefault(+padID, false)))
        case ScheduleType.Drill:
          return Object.keys(newState.wells).reduce((arr, wellID) =>
            arr.push(
              dispatcher.dispatchSingle(calcWellVertDrillDurationDefault(+wellID)),
              dispatcher.dispatchSingle(calcWellHorzDrillDurationDefault(+wellID))
            ) && arr, []
          )
        case ScheduleType.Frac:
          return Object.keys(newState.wells).reduce((arr, wellID) =>
            arr.push(
              dispatcher.dispatchSingle(calcWellFracStages(+wellID, false)),
              dispatcher.dispatchSingle(calcWellStagesPerDay(+wellID, false))
            ) && arr, []
          )
        case ScheduleType.DrillOut:
          return Object.keys(newState.wells).map(wellID => dispatcher.dispatchSingle(calcWellDrillOutDuration(+wellID, false)))
        case ScheduleType.Facilities:
          return Object.keys(newState.pads).map(padID => dispatcher.dispatchSingle(calcPadFacilitiesDurationDefault(+padID, false)))
        default:
          return undefined
      }
    })()).then(resolve)
  })
)

// Pad Construction Duration
export const calcPadConstructionDurationDefault = (padID: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, metrics } = newState, pad = pads[padID]
    let duration = metrics.construction.timing.defDuration
    if (duration === pad.constructionDurationDefault) { resolve(); return }
    dispatcher.batchAction(a_setPadConstructionDurationDefault(newState, padID, duration))
    if (isNumber(pad.manualDurations[ScheduleType.Construction])) { resolve(); return }
    dispatcher.dispatchSingle(setPadConstructionDuration(padID, duration, dispatchTriggers)).then(resolve)
  })
)
const setPadConstructionDurationManual = (padID: number, duration: number, dispatchTriggers = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    if (duration === pad.manualDurations[ScheduleType.Construction]) { resolve(); return; }
    dispatcher.batchAction(a_setPadConstructionDurationManual(newState, padID, duration))
    dispatcher.dispatchSingle(setPadConstructionDuration(padID, duration || pad.constructionDurationDefault, dispatchTriggers)).then(resolve)
  })
)
export const setPadConstructionDuration = (padID: number, duration: number, dispatchTriggers = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (duration === newState.pads[padID].constructionDuration) { resolve(); return }
    dispatcher.batchAction(a_setPadConstructionDuration(newState, padID, duration))
    if (!dispatchTriggers) { resolve(); return; }
    dispatcher.dispatchSingle(calcPadConstructionEnd(padID)).then(resolve)
  })
)

// Drill Duration
export const calcPadDrillDuration = (padID: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, wells } = newState, pad = pads[padID]
    let duration = Object.values(wells).filter(w => w.padID === padID).reduce((dur, w) => dur + w.drillDuration, 0)
    duration = isNumber(duration) ? duration : undefined
    if (duration === pad.drillDuration) { resolve(); return }
    dispatcher.batchAction(a_setPadDrillDuration(newState, padID, duration))
    if (!dispatchTriggers) { resolve(); return; }
    dispatcher.dispatchSingle(calcPadDrillEnd(padID)).then(resolve)
  })
)

// Frac Duration
export const calcPadFracDurationDefault = (padID: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, wells } = newState, pad = pads[padID]
    let duration = Object.values(wells).filter(w => w.padID === pad.padID).reduce(((dur, w) => dur + w.fracDuration), 0)
    duration = isNumber(duration) ? duration : undefined
    if (duration === pad.fracDurationDefault) { resolve(); return }
    dispatcher.batchAction(a_setPadFracDurationDefault(newState, padID, duration))
    if (isNumber(pad.manualDurations[ScheduleType.Frac])) { resolve(); return; }
    dispatcher.dispatchSingle(setPadFracDuration(padID, duration, dispatchTriggers)).then(resolve)
  })
)
const setPadFracDurationManual = (padID: number, duration: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    if (duration === pad.manualDurations[ScheduleType.Frac]) { resolve(); return; }
    dispatcher.batchAction(a_setPadFracDurationManual(newState, padID, duration))
    dispatcher.dispatchSingle(setPadFracDuration(padID, duration || pad.fracDurationDefault)).then(resolve)
  })
)
export const setPadFracDuration = (padID: number, duration: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (duration === newState.pads[padID].fracDuration) { resolve(); return }
    dispatcher.batchAction(a_setPadFracDuration(newState, padID, duration))
    if (dispatchTriggers) {
      dispatcher.dispatchSingle(calcPadFracEnd(padID)).then(resolve)
    } else {
      resolve()
    }
  })
)

// Drill Out Duration
export const calcPadDrillOutDurationDefault = (padID: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, wells } = newState, pad = pads[padID]
    let duration = Object.values(wells).filter(w => w.padID === pad.padID).reduce(((dur, w) => dur + w.drillOutDuration), 0)
    duration = isNumber(duration) ? duration : undefined
    if (duration === pad.drillOutDurationDefault) { resolve(); return }
    dispatcher.batchAction(a_setPadDrillOutDurationDefault(newState, padID, duration))
    if (isNumber(pad.manualDurations[ScheduleType.DrillOut])) { resolve(); return }
    dispatcher.dispatchSingle(setPadDrillOutDuration(padID, duration, dispatchTriggers)).then(resolve)
  })
)
const setPadDrillOutDurationManual = (padID: number, duration: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    if (duration === pad.manualDurations[ScheduleType.DrillOut]) { resolve(); return; }
    dispatcher.batchAction(a_setPadDrillOutDurationManual(newState, padID, duration))
    dispatcher.dispatchSingle(setPadDrillOutDuration(padID, duration || pad.drillOutDurationDefault)).then(resolve)
  })
)
export const setPadDrillOutDuration = (padID: number, duration: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (duration === newState.pads[padID].drillOutDuration) { resolve(); return }
    dispatcher.batchAction(a_setPadDrillOutDuration(newState, padID, duration))
    if (dispatchTriggers) {
      dispatcher.dispatchSingle(calcPadDrillOutEnd(padID)).then(resolve)
    } else {
      resolve()
    }
  })
)

// Facilities Duration
export const calcPadFacilitiesDurationDefault = (padID: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let { pads, metrics } = newState, pad = pads[padID]
    let duration = (pad.wellCount === 0 ? undefined
      : (pad.wellCount < 3 ? metrics.facilities.timing.durationUnder4Wells : metrics.facilities.timing.defDuration))
    duration = isNumber(duration) ? duration : undefined
    if (duration === pad.facilitiesDurationDefault) { resolve(); return }
    dispatcher.batchAction(a_setPadFacilitiesDurationDefault(newState, padID, duration))
    if (isNumber(pad.manualDurations[ScheduleType.Facilities])) { resolve(); return }
    dispatcher.dispatchSingle(setPadFacilitiesDuration(padID, duration, dispatchTriggers)).then(resolve)
  })
)
const setPadFacilitiesDurationManual = (padID: number, duration: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pad = newState.pads[padID]
    if (duration === pad.manualDurations[ScheduleType.Facilities]) { resolve(); return; }
    dispatcher.batchAction(a_setPadFacilitiesDurationManual(newState, padID, duration))
    dispatcher.dispatchSingle(setPadFacilitiesDuration(padID, duration || pad.facilitiesDurationDefault)).then(resolve)
  })
)
export const setPadFacilitiesDuration = (padID: number, duration: number, dispatchTriggers: boolean = true) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (duration === newState.pads[padID].facilitiesDuration) { resolve(); return }
    dispatcher.batchAction(a_setPadFacilitiesDuration(newState, padID, duration))
    if (dispatchTriggers) {
      dispatcher.dispatchSingle(calcPadFacilitiesEnd(padID)).then(resolve)
    } else {
      resolve()
    }
  })
)

export const setPadManualDuration = (padID: number, scheduleType: ScheduleType, duration: number) => (dispatcher: Dispatcher) => (
  new Promise((resolve, reject) => {
    let action
    switch (scheduleType) {
      case ScheduleType.Construction: action = setPadConstructionDurationManual; break
      case ScheduleType.Frac: action = setPadFracDurationManual; break
      case ScheduleType.DrillOut: action = setPadDrillOutDurationManual; break
      case ScheduleType.Facilities: action = setPadFacilitiesDurationManual; break
      default: throw Error('pad-actions.js setPadManualDuration() is not configured to handle ScheduleType ' + scheduleType)
    }
    dispatcher.dispatchSingle(action(padID, duration)).then(resolve)
  })
)

// Manual Delays
const setPadDrillDelayManual = (padID: number, delay: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (delay === newState.pads[padID].manualDelays[ScheduleType.Drill]) { resolve(); return; }
    dispatcher.batchAction(a_setPadDrillDelayManual(newState, padID, delay))
    dispatcher.dispatchSingle(calcPadDrillStartDefault(padID)).then(resolve)
  })
)
const setPadFracDelayManual = (padID: number, delay: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (delay === newState.pads[padID].manualDelays[ScheduleType.Frac]) { resolve(); return; }
    dispatcher.batchAction(a_setPadFracDelayManual(newState, padID, delay))
    dispatcher.dispatchSingle(calcPadFracStartDefault(padID)).then(resolve)
  })
)
const setPadDrillOutDelayManual = (padID: number, delay: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (delay === newState.pads[padID].manualDelays[ScheduleType.DrillOut]) { resolve(); return; }
    dispatcher.batchAction(a_setPadDrillOutDelayManual(newState, padID, delay))
    dispatcher.dispatchSingle(calcPadDrillOutStartDefault(padID)).then(resolve)
  })
)
const setPadFacilitiesDelayManual = (padID: number, delay: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (delay === newState.pads[padID].manualDelays[ScheduleType.Facilities]) { resolve(); return; }
    dispatcher.batchAction(a_setPadFacilitiesDelayManual(newState, padID, delay))
    dispatcher.dispatchSingle(calcPadFacilitiesStartDefault(padID)).then(resolve)
  })
)
export const setPadManualDelay = (padID: number, scheduleType: ScheduleType, delay: number) => dispatcher => (
  new Promise((resolve, reject) => {
    let action
    switch (scheduleType) {
      case ScheduleType.Drill: action = setPadDrillDelayManual; break
      case ScheduleType.Frac: action = setPadFracDelayManual; break
      case ScheduleType.DrillOut: action = setPadDrillOutDelayManual; break
      case ScheduleType.Facilities: action = setPadFacilitiesDelayManual; break
      default: throw Error('pad-actions.js setPadManualDelay is not configured to handle ScheduleType ' + scheduleType)
    }
    dispatcher.dispatchSingle(action(padID, delay)).then(resolve())
  })
)

export const setBatchDrillFlag = (padID: number, batchDrillFlag: boolean) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (batchDrillFlag === newState.pads[padID].batchDrill) { resolve(); return }
    dispatcher.batchAction(a_setBatchDrillFlag(newState, padID, batchDrillFlag))

    let actions = []
    for (let w of Object.values(newState.wells).filter(w => w.padID === padID)) {
      actions.push(
        dispatcher.dispatchSingle(setWellVertDrillOrder(w.wellID, batchDrillFlag ? w.vertDrillOrderManual : w.vertDrillOrderDefault)),
        dispatcher.dispatchSingle(setWellHorzDrillOrder(w.wellID, batchDrillFlag ? w.horzDrillOrderManual : w.horzDrillOrderDefault)),
      )
    }
    Promise.all(actions).then(resolve)
  })
)

export const setIsScheduled = (padID: number, isScheduled: boolean) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    if (isScheduled === newState.pads[padID].isScheduled) { resolve(); return }
    dispatcher.batchAction(a_setIsScheduled(newState, padID, isScheduled))

    let actions = [], wells = Object.values(newState.wells).filter(w => w.padID === padID)
    if (!isScheduled) {
      for (let [scheduleType, crewID] of Object.entries(newState.pads[padID].crews)) {
        actions.push(dispatcher.dispatchSingle(movePad(scheduleType as ScheduleType, padID, undefined, undefined)))
      }
    } else {
      actions.push(
        dispatcher.dispatchSingle(calcPadConstructionCost(padID)),
        dispatcher.dispatchSingle(calcPadDrillRehabCost(padID)),
        dispatcher.dispatchSingle(calcPadCompletionsRehabCost(padID)),
        dispatcher.dispatchSingle(calcPadWaterTransferCost(padID)),
        dispatcher.dispatchSingle(calcWellCount(padID)),
        dispatcher.dispatchSingle(calcPadWorkingInterest(padID)),
        dispatcher.dispatchSingle(calcPadConstructionDurationDefault(padID, false)),
        dispatcher.dispatchSingle(calcPadFacilitiesDurationDefault(padID, false)),
        dispatcher.dispatchSingle(calcPadTIL(padID, false))
      )
      for (let w of wells) {
        actions.push(
          dispatcher.dispatchSingle(calcWellAvgSpacing(w.wellID, false)),
          dispatcher.dispatchSingle(calcWellFracStages(w.wellID, false)),
          dispatcher.dispatchSingle(calcWellVertDrillDurationDefault(w.wellID)),
          dispatcher.dispatchSingle(calcWellHorzDrillDurationDefault(w.wellID)),
          dispatcher.dispatchSingle(calcWellDrillOutDuration(w.wellID, false)),
        )
      }

      Promise.all(actions).then(() => {
        actions = []
        let pad = newState.pads[padID]
        actions.push(
          pad.manualDates.construction ? dispatcher.dispatchSingle(setPadConstructionStart(padID, pad.manualDates.construction)) : undefined,
          pad.manualDates.drill ? dispatcher.dispatchSingle(setPadDrillStart(padID, pad.manualDates.drill)) : undefined,
          pad.manualDates.frac ? dispatcher.dispatchSingle(setPadFracStart(padID, pad.manualDates.frac)) : undefined,
          pad.manualDates.drillOut ? dispatcher.dispatchSingle(setPadDrillOutStart(padID, pad.manualDates.drillOut)) : undefined,
          pad.manualDates.facilities ? dispatcher.dispatchSingle(setPadFacilitiesStart(padID, pad.manualDates.facilities)) : undefined,
        )
        for (let w of wells) {
          actions.push(
            dispatcher.dispatchSingle(calcWellConstructionCostDefault(w.wellID)),
            dispatcher.dispatchSingle(calcWellVertDrillCostDefault(w.wellID)),
            dispatcher.dispatchSingle(calcWellHorzDrillCostDefault(w.wellID)),
            dispatcher.dispatchSingle(calcWellFracCostDefault(w.wellID)),
            dispatcher.dispatchSingle(calcWellDrillOutCostDefault(w.wellID)),
            dispatcher.dispatchSingle(calcWellFacilitiesCostDefault(w.wellID)),
            dispatcher.dispatchSingle(calcWellFlowbackCostDefault(w.wellID))  ,          
          )
        }
      })
    }

    Promise.all(actions).then(resolve)
  })
)

export const calcWellCount= (padID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let wellCount = Object.values(newState.wells).filter(w => w.padID === padID).length
    if (newState.pads[padID].wellCount === wellCount) { resolve(); return }
    dispatcher.batchAction(a_setWellCount(newState, padID, wellCount))
    resolve()
  })
)


// ACTIONS

const a_setPads = (newState: StoreState, pads: Pads) => {
  let a = {
    type: SET_PADS,
    payload: pads
  }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

const a_createTempPad = (newState: StoreState, padID: number, padName: string) => {
  let a = {
    type: CREATE_TEMP_PAD,
    payload: { padID, padName }
  }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

const a_deleteTempPad = (newState: StoreState, padID: number) => {
  let a = {
    type: DELETE_TEMP_PAD,
    payload: padID
  }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

const a_splitPad = (newState: StoreState, padID: number) => {
  let a = {
    type: SPLIT_PAD,
    payload: padID,
  }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

const a_unsplitPad = (newState: StoreState, padID: number) => {
  let a = {
    type: UNSPLIT_PAD,
    payload: padID,
  }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

const a_setPadName = (newState: StoreState, padID: number, padName: string) => {
  let a = {
    type: SET_PAD_NAME,
    payload: { padID, padName },
  }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

const a_setPadCrew = (newState: StoreState, padID: number, scheduleType: ScheduleType, crewID: number) => {
  let a = {
    type: SET_PAD_CREW,
    payload: { padID, scheduleType, crewID }
  }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

const a_setPadSuccessor = (newState: StoreState, padID: number, scheduleType: ScheduleType, successorPadID: number) => {
  let a = {
    type: SET_PAD_SUCCESSOR,
    payload: { padID, scheduleType, successorPadID }
  }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

const a_setPadPredecessor = (newState: StoreState, padID: number, scheduleType: ScheduleType, predecessorPadID: number) => {
  let a = {
    type: SET_PAD_PREDECESSOR,
    payload: { padID, scheduleType, predecessorPadID }
  }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

// DATES

const a_setDate_base = (newState: StoreState, padID: number, date: string, type: string) => {
  let a = { type, payload: { padID, date } }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}
const a_setPadConstructionStartDefault = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_CONSTRUCTION_START_DEFAULT)
const a_setPadConstructionStartManual = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_CONSTRUCTION_START_MANUAL)
const a_setPadConstructionStart = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_CONSTRUCTION_START)
const a_setPadConstructionEnd = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_CONSTRUCTION_END)
const a_setPadDrillStartDefault = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_DRILL_START_DEFAULT)
const a_setPadDrillStartManual = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_DRILL_START_MANUAL)
const a_setPadDrillStart = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_DRILL_START)
const a_setPadDrillEnd = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_DRILL_END)
const a_setPadFracStartDefault = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_FRAC_START_DEFAULT)
const a_setPadFracStartManual = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_FRAC_START_MANUAL)
const a_setPadFracStart = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_FRAC_START)
const a_setPadFracEnd = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_FRAC_END)
const a_setPadDrillOutStartDefault = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_DRILL_OUT_START_DEFAULT)
const a_setPadDrillOutStartManual = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_DRILL_OUT_START_MANUAL)
const a_setPadDrillOutStart = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_DRILL_OUT_START)
const a_setPadDrillOutEnd = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_DRILL_OUT_END)
const a_setPadFacilitiesStartDefault = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_FACILITIES_START_DEFAULT)
const a_setPadFacilitiesStartManual = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_FACILITIES_START_MANUAL)
const a_setPadFacilitiesStart = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_FACILITIES_START)
const a_setPadFacilitiesEnd = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_FACILITIES_END)
const a_setPadTIL = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_TIL)
const a_setPadFirstFlow = (newState: StoreState, padID: number, date) => a_setDate_base(newState, padID, date, SET_PAD_FIRST_FLOW)

// COSTS
const a_setCost_base = (newState: StoreState, padID: number, cost: number, type: string) => {
  let a = { type, payload: { padID, cost } }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}
const a_setPadConstructionCost = (newState: StoreState, padID: number, cost: number) => a_setCost_base(newState, padID, cost, SET_PAD_CONSTRUCTION_COST)
const a_setPadVertDrillCost = (newState: StoreState, padID: number, cost: number) => a_setCost_base(newState, padID, cost, SET_PAD_VERT_DRILL_COST)
const a_setPadHorzDrillCost = (newState: StoreState, padID: number, cost: number) => a_setCost_base(newState, padID, cost, SET_PAD_HORZ_DRILL_COST)
const a_setPadDrillRehabCost = (newState: StoreState, padID: number, cost: number) => a_setCost_base(newState, padID, cost, SET_PAD_DRILL_REHAB_COST)
const a_setPadFracCost = (newState: StoreState, padID: number, cost: number) => a_setCost_base(newState, padID, cost, SET_PAD_FRAC_COST)
const a_setPadCompletionsRehabCost = (newState: StoreState, padID: number, cost: number) => a_setCost_base(newState, padID, cost, SET_PAD_COMPLETIONS_REHAB_COST)
const a_setPadWaterTransferCost = (newState: StoreState, padID: number, cost: number) => a_setCost_base(newState, padID, cost, SET_PAD_WATER_TRANSFER_COST)
const a_setPadDrillOutCost = (newState: StoreState, padID: number, cost: number) => a_setCost_base(newState, padID, cost, SET_PAD_DRILL_OUT_COST)
const a_setPadFacilitiesCost = (newState: StoreState, padID: number, cost: number) => a_setCost_base(newState, padID, cost, SET_PAD_FACILITIES_COST)
const a_setPadFlowbackCost = (newState: StoreState, padID: number, cost: number) => a_setCost_base(newState, padID, cost, SET_PAD_FLOWBACK_COST)

// OTHER

const a_setPadWorkingInterest = (newState: StoreState, padID: number, workingInterest: number) => {
  let a = {
    type: SET_PAD_WORKING_INTEREST,
    payload: { padID, workingInterest }
  }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

// Durations
const a_setPadConstructionDurationDefault = (newState: StoreState, padID: number, duration: number) => a_setDuration_base(newState, padID, duration, SET_PAD_CONSTRUCTION_DURATION_DEFAULT)
const a_setPadConstructionDurationManual = (newState: StoreState, padID: number, duration: number) => a_setDuration_base(newState, padID, duration, SET_PAD_CONSTRUCTION_DURATION_MANUAL)
const a_setPadConstructionDuration = (newState: StoreState, padID: number, duration: number) => a_setDuration_base(newState, padID, duration, SET_PAD_CONSTRUCTION_DURATION)
const a_setPadDrillDuration = (newState: StoreState, padID: number, duration: number) => a_setDuration_base(newState, padID, duration, SET_PAD_DRILL_DURATION)
const a_setPadFracDurationDefault = (newState: StoreState, padID: number, duration: number) => a_setDuration_base(newState, padID, duration, SET_PAD_FRAC_DURATION_DEFAULT)
const a_setPadFracDurationManual = (newState: StoreState, padID: number, duration: number) => a_setDuration_base(newState, padID, duration, SET_PAD_FRAC_DURATION_MANUAL)
const a_setPadFracDuration = (newState: StoreState, padID: number, duration: number) => a_setDuration_base(newState, padID, duration, SET_PAD_FRAC_DURATION)
const a_setPadDrillOutDurationDefault = (newState: StoreState, padID: number, duration: number) => a_setDuration_base(newState, padID, duration, SET_PAD_DRILL_OUT_DURATION_DEFAULT)
const a_setPadDrillOutDurationManual = (newState: StoreState, padID: number, duration: number) => a_setDuration_base(newState, padID, duration, SET_PAD_DRILL_OUT_DURATION_MANUAL)
const a_setPadDrillOutDuration = (newState: StoreState, padID: number, duration: number) => a_setDuration_base(newState, padID, duration, SET_PAD_DRILL_OUT_DURATION)
const a_setPadFacilitiesDurationDefault = (newState: StoreState, padID: number, duration: number) => a_setDuration_base(newState, padID, duration, SET_PAD_FACILITIES_DURATION_DEFAULT)
const a_setPadFacilitiesDurationManual = (newState: StoreState, padID: number, duration: number) => a_setDuration_base(newState, padID, duration, SET_PAD_FACILITIES_DURATION_MANUAL)
const a_setPadFacilitiesDuration = (newState: StoreState, padID: number, duration: number) => a_setDuration_base(newState, padID, duration, SET_PAD_FACILITIES_DURATION)
const a_setDuration_base = (newState: StoreState, padID: number, duration: number, type: string) => {
  let a = { type, payload: { padID, duration } }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

// Delays
const a_setPadDrillDelayManual = (newState: StoreState, padID: number, delay: number) => a_setDelay_base(newState, padID, delay, SET_PAD_DRILL_DELAY_MANUAL)
const a_setPadFracDelayManual = (newState: StoreState, padID: number, delay) => a_setDelay_base(newState, padID, delay, SET_PAD_FRAC_DELAY_MANUAL)
const a_setPadDrillOutDelayManual = (newState: StoreState, padID: number, delay) => a_setDelay_base(newState, padID, delay, SET_PAD_DRILL_OUT_DELAY_MANUAL)
const a_setPadFacilitiesDelayManual = (newState: StoreState, padID: number, delay) => a_setDelay_base(newState, padID, delay, SET_PAD_FACILITIES_DELAY_MANUAL)
const a_setDelay_base = (newState: StoreState, padID: number, delay: number, type: string) => {
  let a = { type, payload: { padID, delay } }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

const a_setBatchDrillFlag = (newState: StoreState, padID: number, batchDrillFlag: boolean) => {
  let a = {
    type: SET_BATCH_DRILL_FLAG,
    payload: { padID, batchDrillFlag }
  }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

const a_setIsScheduled = (newState: StoreState, padID: number, isScheduled: boolean) => {
  let a = {
    type: SET_PAD_IS_SCHEDULED,
    payload: { padID, isScheduled }
  }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

const a_setWellCount = (newState: StoreState, padID: number, wellCount) => {
  let a = {
    type: SET_WELL_COUNT,
    payload: { padID, wellCount }
  }
  newState.pads = pads_reducer(newState.pads, a)
  return a
}

// METHODS

const getCalcScheduleStartDateAction = (scheduleType: ScheduleType) => {
  switch(scheduleType) {
    case ScheduleType.Construction: return calcPadConstructionStartDefault
    case ScheduleType.Drill: return calcPadDrillStartDefault
    case ScheduleType.Frac: return calcPadFracStartDefault
    case ScheduleType.DrillOut: return calcPadDrillOutStartDefault
    case ScheduleType.Facilities: return calcPadFacilitiesStartDefault
    case ScheduleType.Flowback: return calcPadFirstFlow
    default: throw Error('pad-actions.js getCalcScheduleStartDateAction() is not configured to handle ScheduleType ' + scheduleType)
  }
}

const calcStartDateDefault = (pad: Pad, pads: Pads, scheduleType: ScheduleType, scheduleMetrics: ScheduleMetricsBase, endDateAttrName: string) => {
  if (pad.predecessors[scheduleType]) {
    let predPad = pads[pad.predecessors[scheduleType]]
    if (predPad[endDateAttrName]) {
      let delay = isNumber(pad.manualDelays[scheduleType])
        ? pad.manualDelays[scheduleType]
        : isNumber(scheduleMetrics.timing.moveTime)
          ? scheduleMetrics.timing.moveTime
          : 0
      return _Date.addDays(predPad[endDateAttrName], delay)
    }
  }
  return undefined
}

const isWinterMonth = (date: string) => {
  if (!date) { return false }
  return [0,1,11].includes(new Date(date).getMonth()) // Jan,Feb,Dec
}