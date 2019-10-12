/* eslint-disable default-case */
import { ScheduleTypeActionTypes, SELECT_SCHEDULE_TYPE } from '../action-types/scheduleType-action-types'
import { ScheduleType } from '../../types';

// export const selScheduleTypes = (state = { 1: 'Rig', 2: 'Rig' }, {type, payload}) => {
export const selectedScheduleTypes = (state: ScheduleType[] = [ScheduleType.Drill, ScheduleType.Drill], actionsObj): ScheduleType[] => {
  let actions: ScheduleTypeActionTypes[] = Array.isArray(actionsObj) ? actionsObj : [actionsObj], newState = state
  for (let action of actions) {
    switch (action.type) {
      case SELECT_SCHEDULE_TYPE:
        newState = newState.map((value, index) => index === action.payload.viewNum ? action.payload.scheduleType : value)
      break
    }
  }
  return newState
}