import { SET_CREWS, ADD_CREW, UPDATE_CREW, DELETE_CREW, CrewActionTypes } from '../action-types/crew-action-types'
import { crews as crews_reducer } from '../reducers/crews-reducer'
import { ScheduleTypeMap } from '../../models'
import { StoreState, ScheduleType, PartialRecord } from '../../types'
import { Dispatcher } from '../middleware/batched-thunk';
import { movePad } from './pad-actions';

// DISPATCHERS
export const updateCrews = (scheduleType: ScheduleType, crews: Record<number, string>, newCrews: string[]) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let scheduleCrews = newState.crews[scheduleType]
    let actions = []
    for (let [id, name] of Object.entries(scheduleCrews)) {
      if (!crews[id])
        actions.push(dispatcher.dispatchSingle(deleteCrew(scheduleType, +id)))
      else if (name !== crews[id]) {
        dispatcher.batchAction(a_updateCrew(newState, scheduleType, +id, crews[id]))
      }
    }
    let nextCrewID = Math.max(...Object.values(newState.crews).reduce((arr: number[], kvp) => {
      arr.push(...Object.keys(kvp).map(Number))
      return arr
    },[]))
    for (let newCrewName of newCrews)
      dispatcher.batchAction(a_addCrew(newState, scheduleType, nextCrewID, newCrewName))

    Promise.all(actions).then(resolve)
  })
)

export const deleteCrew = (scheduleType: ScheduleType, crewID: number) => (dispatcher: Dispatcher, newState: StoreState) => (
  new Promise((resolve, reject) => {
    let pads = Object.values(newState.pads).filter(p => p.crews[scheduleType] === crewID)
    dispatcher.dispatchMany(pads.map(p => movePad(scheduleType, p.padID, undefined, undefined))).then(() => {
      dispatcher.batchAction(a_deleteCrew(newState, scheduleType, crewID))
      resolve()
    })
  })
)


// ACTIONS
const a_setCrews = (newState: StoreState, crews: PartialRecord<ScheduleType, Record<number, string>>) => {
  let a: CrewActionTypes = {
    type: SET_CREWS,
    payload: crews
  }
  newState.crews = crews_reducer(newState.crews, a)
  return a
}

const a_addCrew = (newState: StoreState, scheduleType: ScheduleType, crewID: number, crewName: string) => {
  const a: CrewActionTypes = {
    type: ADD_CREW,
    payload: { scheduleType, crewID, crewName }
  }
  newState.crews = crews_reducer(newState.crews, a)
  return a
}

const a_updateCrew = (newState: StoreState, scheduleType: ScheduleType, crewID: number, crewName: string) => {
  const a: CrewActionTypes = {
    type: UPDATE_CREW,
    payload: { scheduleType, crewID, crewName }
  }
  newState.crews = crews_reducer(newState.crews, a)
  return a
}

const a_deleteCrew = (newState: StoreState, scheduleType: ScheduleType, crewID: number) => {
  let a: CrewActionTypes = {
    type: DELETE_CREW,
    payload: { scheduleType, crewID }
  }
  newState.crews = crews_reducer(newState.crews, a)
  return a
}