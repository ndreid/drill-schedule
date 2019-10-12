import { SELECT_VIEW } from '../action-types/view-action-types'
import { ViewType, StoreState } from '../../types';
import { Dispatcher } from '../middleware/batched-thunk';
import { selectedViews as viewReducer } from '../reducers/view-reducer'
import { setDirty } from './other-actions';

export const selectView = (viewNum: number, viewName: ViewType) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_selectView(newState, viewNum, viewName))
    dispatcher.dispatchSingle(setDirty(newState.dirty)).then(resolve)
  })
)

export const a_selectView = (newState: StoreState, viewNum: number, viewName: ViewType) => {
  let a = {
    type: SELECT_VIEW,
    payload: { viewNum, viewName }
  }
  newState.selectedViews = viewReducer(newState.selectedViews, a)
  return a
}
