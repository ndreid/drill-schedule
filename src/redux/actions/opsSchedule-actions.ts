import { SET_OPS_SCHEDULE_ID, SET_OPS_SCHEDULES, SET_OPS_SCHEDULE_NAME, OpsScheduleActionTypes } from '../action-types/opsSchedule-action-types'
import { opsSchedules as opsSchedules_reducer, selectedOpsScheduleID as selectedOpsScheduleID_reducer} from '../reducers/opsSchedule-reducer'
import { sqlService } from '../../services'
import { loadMetrics } from './metrics-actions'
import { loadWells, calcWellAvgSpacing, calcWellFracStages, calcWellVertDrillDurationDefault, calcWellHorzDrillDurationDefault, calcWellDrillOutDuration,
        calcWellConstructionCostDefault, calcWellVertDrillCostDefault, calcWellHorzDrillCostDefault, calcWellFracCostDefault, calcWellDrillOutCostDefault, calcWellFacilitiesCostDefault, calcWellFlowbackCostDefault, calcWellDrillRehabCostDefault, calcWellCompletionsRehabCostDefault, calcWellWaterTransferCostDefault, setWellConstructionCost, calcWellVertDrillDuration, calcWellHorzDrillDuration, setWellDrillRehabCost, setWellCompletionsRehabCost, setWellWaterTransferCost, setWellVertDrillCost, setWellHorzDrillCost, setWellFracCost, setWellDrillOutCost, setWellFacilitiesCost, setWellFlowbackCost, calcWellName
} from './well-actions';
import { loadPads, calcPadWorkingInterest, calcPadConstructionDurationDefault, calcPadFacilitiesDurationDefault, calcPadTIL, setPadDrillStart, setPadFracStart,
  setPadConstructionStart, setPadDrillOutStart, setPadFacilitiesStart, calcWellCount, calcPadConstructionCost, calcPadDrillRehabCost, calcPadCompletionsRehabCost, calcPadWaterTransferCost, setPadConstructionDuration, setPadFracDuration, setPadDrillOutDuration, setPadFacilitiesDuration
} from './pad-actions';
import { loadCrews } from './crew-actions';
import { StoreState, OpsSchedules, ScheduleType } from '../../types';
import { loadScheduleState } from '../../localStorage'
import { Dispatcher } from '../middleware/batched-thunk';
import { setDirty, setPreventDocumentSave } from './other-actions';
import { a_setScheduleState } from './state-actions';
import { DBScheduleModel, PadModel, WellModel, CrewModel, ScheduleTypeMap, MetricsModel, PadPredecessorModel, PadCrewModel, PadOverrideModel, WellOverrideModel } from '../../models';
import { isNumber } from 'data-type-ext/_Number'
import { mongoService } from '../../services/index'

// DISPATCHERS

export const loadOpsSchedules = () => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    sqlService.getOpsSchedules(newState.selectedStateCode).then(opsSchedulesRes => {
      let opsSchedules = opsSchedulesRes.reduce((obj, os) => {
        obj[os.opsScheduleID] = os
        return obj
      }, {})
      dispatcher.batchAction(a_setOpsSchedules(newState, opsSchedules))
      dispatcher.dispatchSingle(setDirty(false)).then(resolve)
    }).catch(err => reject(err))
  })
)

export const selectOpsSchedule = (opsScheduleID: number) => (dispatcher: Dispatcher, state: StoreState) => (
  new Promise((resolve, reject) => {

    dispatcher.batchAction(a_setSelectedOpsScheduleID(state, opsScheduleID))
    if (opsScheduleID === null) {
      dispatcher.batchAction(a_setScheduleState({
        dirty: false,
        pads: {},
        wells: {},
        crews: {},
        metrics: undefined,
      }))
      resolve()
      return
    }

    // let persistedState = loadScheduleState(opsScheduleID)
    mongoService.getOpsSchedule(opsScheduleID).then(mongoSchedule => {
      console.log('mongo schedule', mongoSchedule)
      if (mongoSchedule) {
        dispatcher.batchAction(a_setScheduleState(mongoSchedule))
        resolve()
        // dispatcher.dispatchSingle(setPreventDocumentSave(true)).then(resolve)
        return
      }

      dispatcher.dispatchMany([
        loadMetrics(opsScheduleID),
        loadCrews(opsScheduleID),
        loadPads(opsScheduleID),
        loadWells(opsScheduleID),
      ]).then(() => {
        let { pads, wells } = state
        let padIDs = Object.keys(pads).map(id => Number(id))
        let wellIDs = Object.keys(wells).map(id => Number(id))
  
        Promise.all([
          padIDs.reduce((arr, padID) => arr.push(
            dispatcher.dispatchSingle(calcPadConstructionCost(padID)),
            dispatcher.dispatchSingle(calcPadDrillRehabCost(padID)),
            dispatcher.dispatchSingle(calcPadCompletionsRehabCost(padID)),
            dispatcher.dispatchSingle(calcPadWaterTransferCost(padID)),
            dispatcher.dispatchSingle(calcWellCount(padID)),
            // dispatcher.dispatchSingle(calcPadLateralLength(padID)),
            dispatcher.dispatchSingle(calcPadWorkingInterest(padID)),
            dispatcher.dispatchSingle(calcPadConstructionDurationDefault(padID, false)),
            dispatcher.dispatchSingle(calcPadFacilitiesDurationDefault(padID, false)),
            dispatcher.dispatchSingle(calcPadTIL(padID, false))
          ) && arr, []),
          wellIDs.reduce((arr, wellID) => arr.push(
            dispatcher.dispatchSingle(calcWellAvgSpacing(wellID, false)),
            dispatcher.dispatchSingle(calcWellFracStages(wellID, false)),
            dispatcher.dispatchSingle(calcWellVertDrillDurationDefault(wellID)),
            dispatcher.dispatchSingle(calcWellHorzDrillDurationDefault(wellID)),
            dispatcher.dispatchSingle(calcWellDrillOutDuration(wellID, false)),
          ) && arr, [])
        ]).then(() => {
          // pads with manual dates
  
          let padsArr = Object.values(pads)
          dispatcher.dispatchMany([
            ...padsArr.filter(p => p.manualDates.construction).map(p => setPadConstructionStart(p.padID, p.manualDates.construction)),
            ...padsArr.filter(p => p.manualDates.drill).map(p => setPadDrillStart(p.padID, p.manualDates.drill)),
            ...padsArr.filter(p => p.manualDates.frac).map(p => setPadFracStart(p.padID, p.manualDates.frac)),
            ...padsArr.filter(p => p.manualDates.drillOut).map(p => setPadDrillOutStart(p.padID, p.manualDates.drillOut)),
            ...padsArr.filter(p => p.manualDates.facilities).map(p => setPadFacilitiesStart(p.padID, p.manualDates.facilities)),
            ...padsArr.filter(p => p.manualDurations.construction).map(p => setPadConstructionDuration(p.padID, p.manualDurations.construction)),
            ...padsArr.filter(p => p.manualDurations.frac).map(p => setPadFracDuration(p.padID, p.manualDurations.frac)),
            ...padsArr.filter(p => p.manualDurations.drillOut).map(p => setPadDrillOutDuration(p.padID, p.manualDurations.drillOut)),
            ...padsArr.filter(p => p.manualDurations.facilities).map(p => setPadFacilitiesDuration(p.padID, p.manualDurations.facilities)),
          ])
  
          let wellsArr = Object.values(wells)
          dispatcher.dispatchMany([
            ...wellsArr.filter(w => isNumber(w.manualDurations.VertDrill)).map(w => calcWellVertDrillDuration(w.wellID)),
            ...wellsArr.filter(w => isNumber(w.manualDurations.HorzDrill)).map(w => calcWellHorzDrillDuration(w.wellID)),
            ...wellsArr.filter(w => isNumber(w.afes.construction)).map(w => setWellConstructionCost(w.wellID, w.afes.construction)),
            ...wellsArr.filter(w => isNumber(w.afes.drillRehab)).map(w => setWellDrillRehabCost(w.wellID, w.afes.drillRehab)),
            ...wellsArr.filter(w => isNumber(w.afes.completionsRehab)).map(w => setWellCompletionsRehabCost(w.wellID, w.afes.completionsRehab)),
            ...wellsArr.filter(w => isNumber(w.afes.waterTransfer)).map(w => setWellWaterTransferCost(w.wellID, w.afes.waterTransfer)),
            ...wellsArr.filter(w => isNumber(w.afes.vertDrill)).map(w => setWellVertDrillCost(w.wellID, w.afes.vertDrill)),
            ...wellsArr.filter(w => isNumber(w.afes.horzDrill)).map(w => setWellHorzDrillCost(w.wellID, w.afes.horzDrill)),
            ...wellsArr.filter(w => isNumber(w.afes.frac)).map(w => setWellFracCost(w.wellID, w.afes.frac)),
            ...wellsArr.filter(w => isNumber(w.afes.drillOut)).map(w => setWellDrillOutCost(w.wellID, w.afes.drillOut)),
            ...wellsArr.filter(w => isNumber(w.afes.facilities)).map(w => setWellFacilitiesCost(w.wellID, w.afes.facilities)),
            ...wellsArr.filter(w => isNumber(w.afes.flowback)).map(w => setWellFlowbackCost(w.wellID, w.afes.flowback)),
          ])
    
          for (let wellID of wellIDs) {
            dispatcher.dispatchMany([
              state.selectedStateCode === 'OH' ? calcWellName(wellID) : undefined,
              calcWellConstructionCostDefault(wellID),
              calcWellVertDrillCostDefault(wellID),
              calcWellHorzDrillCostDefault(wellID),
              calcWellDrillRehabCostDefault(wellID),
              calcWellFracCostDefault(wellID),
              calcWellCompletionsRehabCostDefault(wellID),
              calcWellWaterTransferCostDefault(wellID),
              calcWellDrillOutCostDefault(wellID),
              calcWellFacilitiesCostDefault(wellID),
              calcWellFlowbackCostDefault(wellID),
            ].filter(Boolean))
          }
          
          dispatcher.dispatchSingle(setDirty(false))
          resolve()
  
        })
      })
    })
  })
)

export const setOpsScheduleName = (opsScheduleID: number, opsScheduleName: string) => (dispatcher: Dispatcher, state: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setOpsScheduleName(state, opsScheduleID, opsScheduleName))
    resolve()
  })
)

export const saveOpsSchedule = () => (dispatcher: Dispatcher, state: StoreState) => (
  new Promise((resolve, reject) => {
    sqlService.saveOpsSchedule(state.selectedOpsScheduleID, getDbScheduleModel(state)).then(() => {
      dispatcher.dispatchSingle(setDirty(false)).then(resolve)
    })
  })
)

export const saveOpsScheduleAs = (opsScheduleName: string) => (dispatcher: Dispatcher, state: StoreState) => (
  new Promise<number>((resolve, reject) => {
    sqlService.saveOpsScheduleAs(opsScheduleName, state.selectedStateCode, getDbScheduleModel(state)).then((opsScheduleID) => resolve(opsScheduleID))
  })
)

export const saveOpsScheduleTo = (opsScheduleID: number) => (dispatcher: Dispatcher, state: StoreState) => (
  new Promise<number>((resolve, reject) => {
    sqlService.saveOpsScheduleTo(opsScheduleID, getDbScheduleModel(state)).then(opsScheduleID =>
      resolve(opsScheduleID)
    )
  })
)

export const createOpsScheduleFrom = (opsScheduleName: string, srcOpsScheduleID: number, srcType: 'app' | 'smartsheet') => (dispatcher: Dispatcher, state: StoreState) => (
  new Promise<number>((resolve, reject) => {
    console.error('NOT CONFIGURED TO CREATE OPS SCHEDULE FROM ANOTHER (createOpsScheduleFrom)')
    if (srcType === 'smartsheet') {
      resolve()
      return
    }
    // sqlService.copyOpsSchedule(srcOpsScheduleID, state.selectedOpsScheduleID)
  })
)

export const copyOpsScheduleFrom = (srcOpsScheduleID: number, tgtOpsScheduleID: number, srcType: 'app' | 'smartsheet') => (dispatcher: Dispatcher, state: StoreState) => (
  new Promise((resolve, reject) => {
    console.error('NOT CONFIGURED TO COPY OPS SCHEDULE FROM ANOTHER (copyOpsScheduleFrom)')
    if (srcType === 'smartsheet') {
      resolve()
      return
    }
    // sqlService.copyOpsSchedule(srcOpsScheduleID, state.selectedOpsScheduleID)
  })
)

export const deleteOpsSchedule = (opsScheduleID: number) => (dispatcher: Dispatcher, state: StoreState) => (
  new Promise((resolve, reject) => {
    sqlService.deleteOpsSchedule(opsScheduleID).then(() => {
      console.log('deleted Ops Schedule')
      dispatcher.dispatchSingle(loadOpsSchedules()).then(() => {
        console.log('loaded ops Schedules')
        dispatcher.dispatchSingle(selectOpsSchedule(undefined)).then(() => {
          console.log('selected ops schedule')
          resolve()
        })
      })
    })
  })
)

// ACTIONS

const a_setSelectedOpsScheduleID = (newState: StoreState, opsScheduleID: number) => {
  let a = {
    type: SET_OPS_SCHEDULE_ID,
    payload: opsScheduleID
  }
  newState.selectedOpsScheduleID = selectedOpsScheduleID_reducer(opsScheduleID, a)
  return a
}

const applyOpsSchedulesAction = (s: StoreState, a: OpsScheduleActionTypes) => {
  s.opsSchedules = opsSchedules_reducer(s.opsSchedules, a)
  return a
}
const a_setOpsSchedules = (s: StoreState, opsSchedules: OpsSchedules) => applyOpsSchedulesAction(s, { type: SET_OPS_SCHEDULES, payload: opsSchedules })
const a_setOpsScheduleName = (s: StoreState, opsScheduleID: number, opsScheduleName: string) => applyOpsSchedulesAction(s, { type: SET_OPS_SCHEDULE_NAME, payload: { opsScheduleID, opsScheduleName } })

// Functions

const getDbScheduleModel = (state: StoreState): DBScheduleModel => {

  let pads: PadModel[] = [], padPredecessors: PadPredecessorModel[] = [], padCrews: PadCrewModel[] = [], padOverrides: PadOverrideModel[] = [], wells: WellModel[] = [], wellOverrides: WellOverrideModel[] = []
  for (let p of Object.values(state.pads)) {
    pads.push({
      padID: p.padID,
      opsScheduleID: state.selectedOpsScheduleID,
      gisPadID: p.gisPadID,
      padName: p.padName,
      batchDrill: p.batchDrill,
      isScheduled: p.isScheduled,
      activityCode: p.activityCode,
      isSplit: p.isSplit,
      temp: p.temp,
    })

    for (let [st, predID] of Object.entries(p.predecessors)) {
      padPredecessors.push({
        padID: p.padID,
        scheduleTypeID: ScheduleTypeMap[st],
        predecessorPadID: predID,
      })
    }

    for (let [st, crewID] of Object.entries(p.crews)) {
      padCrews.push({
        padID: p.padID,
        crewID: crewID,
        scheduleTypeID: ScheduleTypeMap[st],
      })
    }

    for (let st of Object.values(ScheduleType)) {
      padOverrides.push({
        padID: p.padID,
        scheduleTypeID: ScheduleTypeMap[st],
        startDate: p.manualDates[st],
        duration: p.manualDurations[st],
        delay: p.manualDelays[st],
      })
    }
  }

  for (let w of Object.values(state.wells)) {
    wells.push({
      wellID: w.wellID,
      opsScheduleID: state.selectedOpsScheduleID,
      lateralID: w.lateralID,
      padID: w.padID,
      predecessorWellID: w.predecessorWellID,
      gpWellNo: w.gpWellNo,
      wellName: w.wellName,
      phaseWindow: w.phaseWindow,
      formation: w.formation,
      districtTownship: w.districtTownship,
      surfaceLocation: w.surfaceLocation,
      lateralSite: w.lateralSite,
      unitID: w.unitID,
      unit: w.unit,
      section: w.section,
      townshipRange: w.townshipRange,
      workingInterest: w.workingInterest,
      lateralLength: w.lateralLength,
      tvd: w.tvd,
      tmd: w.tmd,
      spacingLeft: w.spacingLeft,
      spacingRight: w.spacingRight,
    })

    wellOverrides.push({
      wellID: w.wellID,
      vertDrillOrder: w.vertDrillOrderManual,
      horzDrillOrder: w.horzDrillOrderManual,
      vertDrillDuration: w.manualDurations.VertDrill,
      horzDrillDuration: w.manualDurations.HorzDrill,
      constructionAFE: w.afes.construction,
      drillRehabAFE: w.afes.drillRehab,
      completionsRehabAFE: w.afes.completionsRehab,
      waterTransferAFE: w.afes.waterTransfer,
      vertDrillAFE: w.afes.vertDrill,
      horzDrillAFE: w.afes.horzDrill,
      fracAFE: w.afes.frac,
      drillOutAFE: w.afes.drillOut,
      facilitiesAFE: w.afes.facilities,
      flowbackAFE: w.afes.flowback,
    })
  }

  let crews = Object.entries(state.crews).reduce<CrewModel[]>((arr, [scheduleType, scheduleCrews]) => {
    for (let [crewID, crewName] of Object.entries(scheduleCrews))
      arr.push({
        crewID: +crewID,
        opsScheduleID: state.selectedOpsScheduleID,
        scheduleTypeID: ScheduleTypeMap[scheduleType],
        crewName
      })
    return arr
  },[])

  let metrics = Object.entries(state.metrics).map<MetricsModel>(([scheduleType, scheduleMetrics]) => ({
      metricsID: scheduleMetrics.opsScheduleID,
      metricsJSON: JSON.stringify(scheduleMetrics),
      scheduleTypeID: ScheduleTypeMap[scheduleType],
      opsScheduleID: state.selectedOpsScheduleID
  }))

  return { pads, padOverrides, padCrews, padPredecessors, wells, wellOverrides, crews, metrics }
}