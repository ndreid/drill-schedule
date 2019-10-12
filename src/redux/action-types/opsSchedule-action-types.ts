import { StoreState, OpsSchedules } from '../../types'

export const SET_OPS_SCHEDULE_ID = 'SET_OPS_SCHEDULE_ID'
interface SetOpsScheduleIdAction {
  type: typeof SET_OPS_SCHEDULE_ID
  payload: number
}

export const SET_OPS_SCHEDULES = 'SET_OPS_SCHEDULES'
interface SetOpsSchedulesAction {
  type: typeof SET_OPS_SCHEDULES
  payload: OpsSchedules
}

export const SET_OPS_SCHEDULE_NAME = 'SET_OPS_SCHEDULE_NAME'
interface SetOpsSchedulNameAction {
  type: typeof SET_OPS_SCHEDULE_NAME
  payload: {
    opsScheduleID: number
    opsScheduleName: string
  }
}

export const CREATE_OPS_SCHEDULE = 'CREATE_OPS_SCHEDULE'
interface CreateOpsScheduleAction {
  type: typeof CREATE_OPS_SCHEDULE
  payload: {
    opsScheduleName: string
    copiedOpsScheduleID: number
  }
}

export const DELETE_OPS_SCHEDULE = 'DELETE_OPS_SCHEDULE'
interface DeleteOpsScheduleAction {
  type: typeof DELETE_OPS_SCHEDULE
  payload: number
}

export type OpsScheduleActionTypes = SetOpsScheduleIdAction | SetOpsSchedulesAction | CreateOpsScheduleAction | DeleteOpsScheduleAction | SetOpsSchedulNameAction