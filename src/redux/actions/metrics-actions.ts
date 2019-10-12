import { SET_METRICS, SET_SCHEDULE_METRICS } from '../action-types/metrics-action-types'
import { metrics as metrics_reducer } from '../reducers/metrics-reducer'
import { calcAllScheduleDurations, calcAllPadScheduleDates } from './pad-actions'
import { calcAllWellScheduleCosts } from './well-actions'
import { sqlService } from '../../services'
import { StoreState, Metrics, ScheduleType, ScheduleMetricsBase } from '../../types'
import { Dispatcher } from '../middleware/batched-thunk';
import { ScheduleTypeMap } from '../../models';

// DISPATCHERS
export const loadMetrics = (opsScheduleID: number) => (dispatcher: Dispatcher, newState: StoreState) => {
  return new Promise((resolve, reject) => {
    sqlService.getMetrics(opsScheduleID)
    .then(metricsModels => {
      let metrics: Metrics = {
        construction: JSON.parse(metricsModels.find(m => m.scheduleTypeID === ScheduleTypeMap[ScheduleType.Construction]).metricsJSON),
        drill: JSON.parse(metricsModels.find(m => m.scheduleTypeID === ScheduleTypeMap[ScheduleType.Drill]).metricsJSON),
        frac: JSON.parse(metricsModels.find(m => m.scheduleTypeID === ScheduleTypeMap[ScheduleType.Frac]).metricsJSON),
        drillOut: JSON.parse(metricsModels.find(m => m.scheduleTypeID === ScheduleTypeMap[ScheduleType.DrillOut]).metricsJSON),
        facilities: JSON.parse(metricsModels.find(m => m.scheduleTypeID === ScheduleTypeMap[ScheduleType.Facilities]).metricsJSON),
        flowback: JSON.parse(metricsModels.find(m => m.scheduleTypeID === ScheduleTypeMap[ScheduleType.Flowback]).metricsJSON),
      }

      Object.values(metrics).forEach(m => m.opsScheduleID === opsScheduleID)
      dispatcher.batchAction(a_setMetrics(newState, metrics))
      resolve()
    })
    .catch(err => reject(err))
  })
}

export const setScheduleMetrics = (scheduleType: ScheduleType, scheduleMetrics) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setScheduleMetrics(newState, scheduleType, scheduleMetrics))
    dispatcher.dispatchSingle(calcAllScheduleDurations(scheduleType))
    dispatcher.dispatchSingle(calcAllPadScheduleDates(scheduleType))
    dispatcher.dispatchSingle(calcAllWellScheduleCosts(scheduleType))
    resolve()
  })
)

// ACTIONS
const a_setMetrics = (newState: StoreState, metrics: Metrics) => {
  let a = {
    type: SET_METRICS,
    payload: metrics
  }
  newState.metrics = metrics_reducer(newState.metrics, a)
  return a
}

const a_setScheduleMetrics = (newState: StoreState, scheduleType: ScheduleType, metrics: ScheduleMetricsBase) => {
  let a = {
    type: SET_SCHEDULE_METRICS,
    payload: { scheduleType, metrics }
  }
  newState.metrics = metrics_reducer(newState.metrics, a)
  return a
}
