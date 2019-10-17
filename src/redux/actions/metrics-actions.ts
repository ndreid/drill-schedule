import { SET_METRICS, SET_SCHEDULE_METRICS } from '../action-types/metrics-action-types'
import { metrics as metrics_reducer } from '../reducers/metrics-reducer'
import { calcAllScheduleDurations, calcAllPadScheduleDates } from './pad-actions'
import { calcAllWellScheduleCosts } from './well-actions'
import { StoreState, Metrics, ScheduleType, ScheduleMetricsBase } from '../../types'
import { Dispatcher } from '../middleware/batched-thunk';

// DISPATCHERS
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
