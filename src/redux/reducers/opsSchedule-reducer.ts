/* eslint-disable default-case */
import { OpsScheduleActionTypes, SET_OPS_SCHEDULE_ID, SET_OPS_SCHEDULES, SET_OPS_SCHEDULE_NAME } from '../action-types/opsSchedule-action-types'
import { OpsSchedules, OpsSchedule } from '../../types';

export const selectedOpsScheduleID = (state: number = null, actionsObj): number => {
  let actions: OpsScheduleActionTypes[] = Array.isArray(actionsObj) ? actionsObj : [actionsObj], newState = state
  for (let action of actions) {
    switch (action.type) {
      case SET_OPS_SCHEDULE_ID:
        newState = action.payload
    }
  }
  return newState
}

export const opsSchedules = (state: OpsSchedules = {}, actionsObj): OpsSchedules => {
  let actions: OpsScheduleActionTypes[] = Array.isArray(actionsObj) ? actionsObj : [actionsObj], newState = state
  for (let action of actions) {
    switch (action.type) {
      case SET_OPS_SCHEDULES:
        newState = action.payload
        break
      case SET_OPS_SCHEDULE_NAME:
        newState = {
          ...newState,
          [action.payload.opsScheduleID]: opsSchedule(newState[action.payload.opsScheduleID], action)
        }
        break
    }
  }
  return newState
}

const opsSchedule = (state: OpsSchedule, action: OpsScheduleActionTypes): OpsSchedule => {
  switch (action.type) {
    case SET_OPS_SCHEDULE_NAME:
      return {
        ...state,
        opsScheduleName: action.payload.opsScheduleName
      }
    default: return state
  }
}