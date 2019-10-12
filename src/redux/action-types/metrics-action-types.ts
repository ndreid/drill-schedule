import { Metrics, ScheduleMetricsBase, ScheduleType } from '../../types'

export const SET_METRICS = 'SET_METRICS'
interface SetMetricsAction {
  readonly type: typeof SET_METRICS
  payload: Metrics
}

export const SET_SCHEDULE_METRICS = 'SET_SCHEDULE_METRICS'
interface SetScheduleMetricsAction {
  readonly type: typeof SET_SCHEDULE_METRICS
  payload: {
    scheduleType: ScheduleType
    metrics: ScheduleMetricsBase
  }
}

export type MetricsActionTypes = SetMetricsAction | SetScheduleMetricsAction