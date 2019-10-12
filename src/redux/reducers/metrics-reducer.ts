
import { MetricsActionTypes, SET_METRICS, SET_SCHEDULE_METRICS } from '../action-types/metrics-action-types'
import { Metrics } from '../../types';

export const metrics = (state: Metrics = null, actionsObj): Metrics => {
  let actions: MetricsActionTypes[] = Array.isArray(actionsObj) ? actionsObj : [actionsObj], newState = state
  for (let action of actions) {
    switch (action.type) {
      case SET_METRICS:
        newState = action.payload
        break
      case SET_SCHEDULE_METRICS:
        newState = {
          ...newState,
          [action.payload.scheduleType]: action.payload.metrics
        }
        break
    }
  }
  return newState
}
