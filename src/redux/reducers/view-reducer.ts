/* eslint-disable default-case */
import { ViewActionTypes, SELECT_VIEW } from '../action-types/view-action-types'
import { ViewType } from '../../types';

export const selectedViews = (state: ViewType[] = [ViewType.Table, ViewType.Metrics], actionsObj): ViewType[] => {
  let actions: ViewActionTypes[] = Array.isArray(actionsObj) ? actionsObj : [actionsObj], newState = state
  for (let action of actions) {
    switch (action.type) {
      case SELECT_VIEW:
        newState = newState.map((value, index) => index === action.payload.viewNum ? action.payload.viewName : value)
        break
    }
  }
  return newState
}