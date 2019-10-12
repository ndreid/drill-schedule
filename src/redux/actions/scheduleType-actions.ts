import { SELECT_SCHEDULE_TYPE } from '../action-types/scheduleType-action-types'
import { ScheduleType, StoreState } from '../../types';
import { Dispatcher } from '../middleware/batched-thunk';
import { selectedScheduleTypes as scheduleTypeReducer} from '../reducers/scheduleType-reducer'
import { setDirty } from './other-actions';

export const selectScheduleType = (viewNum: number, scheduleType: ScheduleType) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_selectScheduleType(newState, viewNum, scheduleType))
    dispatcher.dispatchSingle(setDirty(newState.dirty)).then(resolve)
  })
)

const a_selectScheduleType = (newState: StoreState, viewNum: number, scheduleType: ScheduleType) => {
  let a = {
    type: SELECT_SCHEDULE_TYPE,
    payload: { viewNum, scheduleType }
  }
  newState.selectedScheduleTypes = scheduleTypeReducer(newState.selectedScheduleTypes, a)
  return a
}
