import { StoreState, ScheduleState, SettingsState } from "./types";

// import moment from 'moment'

export const loadStoreState = (opsScheduleID: number): StoreState => {
  let scheduleState = loadScheduleState(opsScheduleID)
  let settingsState = loadSettingsState()

  return Object.assign({}, scheduleState, settingsState)
}

export const loadScheduleState = (opsScheduleID: number) => {
  try {
    const serializedState = localStorage.getItem('ops-schedule-state-' + opsScheduleID)
    if (serializedState === null) {
      return undefined
    }
    let persistedState: ScheduleState = JSON.parse(serializedState)

    return persistedState
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export const loadSettingsState = () => {
  try {
    const serializedSettings = localStorage.getItem('ops-schedule-settings')
    if (serializedSettings === null) {
      return undefined
    }
    let persistedSettings: SettingsState = JSON.parse(serializedSettings)
    return persistedSettings
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export const saveState = (opsScheduleID: number, state: StoreState) => {
  try {
    let { selectedScheduleTypes, selectedViews, selectedOpsScheduleID, opsSchedules, modal, spinnerVisible, ...scheduleState } = state
    const serializedState = JSON.stringify(scheduleState)
    localStorage.setItem('ops-schedule-state-' + opsScheduleID, serializedState)
    localStorage.setItem('ops-schedule-settings', JSON.stringify({ selectedScheduleTypes, selectedViews, selectedOpsScheduleID, opsSchedules }))
  } catch (err) {
    console.log(err)
  }
}