import { combineReducers } from 'redux'
import { selectedScheduleTypes } from './scheduleType-reducer'
import { selectedViews } from './view-reducer'
import { selectedStateCode } from './stateCode-reducer'
import { opsSchedules, selectedOpsScheduleID } from './opsSchedule-reducer'
import { pads } from './pads-reducer'
import { wells } from './wells-reducer'
import { crews } from './crews-reducer'
import { metrics } from './metrics-reducer'
import { modal } from './modal-reducer'
import { spinnerVisible, dirty, preventDocumentSave } from './other-reducer'
import { SET_STATE, StateActionType, SET_SETTINGS_STATE, SET_SCHEDULE_STATE } from '../action-types/state-action-types';
import { StoreState } from '../../types';

const appReducer = combineReducers({
  spinnerVisible,
  selectedScheduleTypes,
  selectedViews,
  opsSchedules,
  selectedStateCode,
  selectedOpsScheduleID,
  modal,
  dirty,
  preventDocumentSave,
  pads,
  wells,
  crews,
  metrics,
})

export default (state, actionsObj): StoreState => {
  let actions: StateActionType[] = actionsObj.type === 'ARRAY' ? Object.values(actionsObj) : [actionsObj]

  for (let action of actions) {
    switch (action.type) {
      case SET_STATE:
        state = action.payload
        break
      case SET_SETTINGS_STATE:
        state = {
          ...state,
          ...action.payload
        }
        break
      case SET_SCHEDULE_STATE:
        state = {
          ...state,
          ...action.payload
        }
        break
    }
  }
    
  //@ts-ignore
  let newState = appReducer(state, actions)
  //@ts-ignore
  return newState
}