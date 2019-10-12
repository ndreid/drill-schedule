/* eslint-disable default-case */
import { CrewActionTypes, SET_CREWS, ADD_CREW, UPDATE_CREW, DELETE_CREW } from '../action-types/crew-action-types'
import { ScheduleType, PartialRecord } from '../../types';

const defualtState = {
  construction: {},
  drill: {},
  frac: {},
  drillOut: {},
  facilities: {},
  flowback: {},
}
// export const crews = (state = {}, { type, payload }) => {
export const crews = (state: PartialRecord<ScheduleType, Record<number, string>> = defualtState, actionsObj): PartialRecord<ScheduleType, Record<number, string>> => {
  let actions: CrewActionTypes[] = Array.isArray(actionsObj) ? actionsObj : [actionsObj], newState = state
  for (let action of actions) {
    switch (action.type) {
      case SET_CREWS:
        newState = action.payload
        break
      case ADD_CREW:
      case UPDATE_CREW:
      case DELETE_CREW:
        newState = {
          ...newState,
          [action.payload.scheduleType]: scheduleCrews(newState[action.payload.scheduleType], action)
        }
    }
  }
  return newState
}

const scheduleCrews = (state: Record<number, string>, action: CrewActionTypes) => {
  switch (action.type) {
    case ADD_CREW:
      return {
        ...state,
        [action.payload.crewID]: action.payload.crewName
      }
    case UPDATE_CREW:
      return {
        ...state,
        [action.payload.crewID]: action.payload.crewName
      }
    case DELETE_CREW:
      let { [action.payload.crewID]: deletedCrew, ...remainingCrews } = state
      return remainingCrews
    default: return state
  }
}