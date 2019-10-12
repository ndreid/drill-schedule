/* eslint-disable default-case */
import { OtherActionTypes, SET_SPINNER_VISIBILITY, SET_DIRTY, SET_PREVENT_DOCUMENT_SAVE } from '../action-types/other-action-types'
import { SET_SCHEDULE_STATE } from '../action-types/state-action-types';
import { SET_OPS_SCHEDULE_ID } from '../action-types/opsSchedule-action-types';

// export const spinnerVisible = (state = false, { type, payload }) => {
export const spinnerVisible = (state = false, actionsObj): boolean => {
  let actions: OtherActionTypes[] = Array.isArray(actionsObj) ? actionsObj : [actionsObj], newState = state
  for (let action of actions) {
    switch (action.type) {
      case SET_SPINNER_VISIBILITY:
        newState = action.payload
        break
    }
  }
  return newState
}

export const dirty = (state = false, actionsObj): boolean => {
  let actions: OtherActionTypes[] = Array.isArray(actionsObj) ? actionsObj : [actionsObj]
  return !actions.some(a => a.type === SET_DIRTY) ? true : actions.find(a => a.type === SET_DIRTY).payload
}

export const preventDocumentSave = (state = false, actionsObj): boolean => {
  let actions = Array.isArray(actionsObj) ? actionsObj : [actionsObj]
  return actions.some(a => a.type
    && a.type !== SET_SPINNER_VISIBILITY
    && a.type !== SET_DIRTY
    && a.type !== SET_SCHEDULE_STATE
    && a.type !== SET_OPS_SCHEDULE_ID) ? false : true
}