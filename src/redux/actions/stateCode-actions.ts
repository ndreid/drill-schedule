import { StoreState } from '../../types';
import { StateCodeActionType } from '../action-types/stateCode-action-types';
import { selectedStateCode as stateCode_reducer } from '../reducers/stateCode-reducer'

const applyStateCodeAction = (s: StoreState, a: StateCodeActionType) => {
  s.selectedStateCode = stateCode_reducer(s.selectedStateCode, a)
  return a
}