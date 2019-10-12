import { StateCodeActionType, SELECT_STATE_CODE } from '../action-types/stateCode-action-types';

export const selectedStateCode = (state: string = 'OH', actionsObj): string => {
  let actions: StateCodeActionType[] = Array.isArray(actionsObj) ? actionsObj : [actionsObj], newState = state
  for (let action of actions) {
    switch (action.type) {
      case SELECT_STATE_CODE:
        newState = action.payload
      break
    }
  }
  return newState
}