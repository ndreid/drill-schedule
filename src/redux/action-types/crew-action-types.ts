import { ScheduleType, PartialRecord } from "../../types";

export const SET_CREWS = 'SET_CREWS'
interface SetCrewsAction {
  type: typeof SET_CREWS
  payload: PartialRecord<ScheduleType, Record<number, string>>
}

export const ADD_CREW = 'ADD_CREW'
interface AddCrewAction {
  type: typeof ADD_CREW
  payload: {
    scheduleType: ScheduleType
    crewID: number
    crewName: string
  }
}

export const UPDATE_CREW = 'UPDATE_CREW'
interface UpdateCrewAction {
  type: typeof UPDATE_CREW
  payload: {
    scheduleType: ScheduleType
    crewID: number
    crewName: string
  }
}

export const DELETE_CREW = 'DELETE CREW'
interface DeleteCrewAction {
  type: typeof DELETE_CREW
  payload: {
    scheduleType: ScheduleType
    crewID: number
  }
}

export type CrewActionTypes = SetCrewsAction | AddCrewAction | UpdateCrewAction | DeleteCrewAction