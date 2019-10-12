/* eslint-disable default-case */
import { ModalActionType, OPEN_MODAL, CLOSE_MODAL } from '../action-types/modal-action-types'
import { StoreState } from '../../types';

export const modal = (state: StoreState['modal'] = null, actionsObj): StoreState['modal'] => {
  let actions: ModalActionType[] = Array.isArray(actionsObj) ? actionsObj : [actionsObj], newState = state
  for (let action of actions) {
    switch (action.type) {
      case OPEN_MODAL:
        newState = {
          ...action.payload
        }
        break
      case CLOSE_MODAL:
        newState = null
        break
    }
  }
  return newState
}