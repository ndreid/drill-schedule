import { ScheduleType } from '../../types'

export const SELECT_SCHEDULE_TYPE = 'SELECT_SCHEDULE_TYPE'
interface SelectScheduleTypeAction {
  type: typeof SELECT_SCHEDULE_TYPE
  payload: {
    viewNum: number
    scheduleType: ScheduleType
  }
}

export type ScheduleTypeActionTypes = SelectScheduleTypeAction