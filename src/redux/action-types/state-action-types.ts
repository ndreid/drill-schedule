import { StoreState, ScheduleState, SettingsState } from "../../types";

export const SET_STATE = 'SET_STATE'
interface SetStateAction {
  type: typeof SET_STATE
  payload: StoreState
}

export const SET_SETTINGS_STATE = 'SET_SETTINGS_STATE'
interface SetSettingsStateAction {
  type: typeof SET_SETTINGS_STATE
  payload: SettingsState
}

export const SET_SCHEDULE_STATE = 'SET_SCHEDULE_STATE'
interface SetScheduleStateAction {
  type: typeof SET_SCHEDULE_STATE
  payload: ScheduleState
}

export type StateActionType = SetStateAction | SetSettingsStateAction | SetScheduleStateAction
