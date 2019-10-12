import { StoreState } from '../../types';
import { Dispatcher } from '../middleware/batched-thunk';
import { SELECT_STATE_CODE, StateCodeActionType } from '../action-types/stateCode-action-types';
import { selectedStateCode as stateCode_reducer } from '../reducers/stateCode-reducer'
import { selectOpsSchedule, loadOpsSchedules } from './opsSchedule-actions';

export const selectStateCode = (stateCode: string) => (dipsatcher: Dispatcher, state: StoreState) => (
  new Promise((resolve, reject) => {
    if (stateCode === state.selectedStateCode) { resolve(); return }
    dipsatcher.batchAction(a_selectStateCode(state, stateCode))
    dipsatcher.dispatchMany([
      loadOpsSchedules(),
      selectOpsSchedule(null),
    ]).then(resolve)
  })
)

const applyStateCodeAction = (s: StoreState, a: StateCodeActionType) => {
  s.selectedStateCode = stateCode_reducer(s.selectedStateCode, a)
  return a
}

const a_selectStateCode = (s: StoreState, stateCode: string) => applyStateCodeAction(s, { type: SELECT_STATE_CODE, payload: stateCode })