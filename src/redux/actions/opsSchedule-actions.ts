import { SET_OPS_SCHEDULE_NAME, OpsScheduleActionTypes } from '../action-types/opsSchedule-action-types'
import { opsSchedules as opsSchedules_reducer } from '../reducers/opsSchedule-reducer'
import { StoreState } from '../../types';
import { Dispatcher } from '../middleware/batched-thunk';
// DISPATCHERS

export const setOpsScheduleName = (opsScheduleID: number, opsScheduleName: string) => (dispatcher: Dispatcher, state: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setOpsScheduleName(state, opsScheduleID, opsScheduleName))
    resolve()
  })
)

// ACTIONS

const applyOpsSchedulesAction = (s: StoreState, a: OpsScheduleActionTypes) => {
  s.opsSchedules = opsSchedules_reducer(s.opsSchedules, a)
  return a
}
const a_setOpsScheduleName = (s: StoreState, opsScheduleID: number, opsScheduleName: string) => applyOpsSchedulesAction(s, { type: SET_OPS_SCHEDULE_NAME, payload: { opsScheduleID, opsScheduleName } })