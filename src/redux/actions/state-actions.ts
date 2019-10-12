import { StoreState, SettingsState, ScheduleState } from '../../types';
import { SET_STATE, SET_SETTINGS_STATE, SET_SCHEDULE_STATE } from '../action-types/state-action-types';
// import { Dispatcher } from '../middleware/batched-thunk';

// export const setState = (state: StoreState) => (dispatcher: Dispatcher) => dispatcher.batchAction(a_setState(state))
// export const setSettingsState = (state: SettingsState) => (dispatcher: Dispatcher) => dispatcher.batchAction(a_setSettingsState(state))
// export const setScheduleState = (state: ScheduleState) => (dispatcher: Dispatcher) => dispatcher.batchAction(a_setScheduleState(state))

export const a_setState = (state: StoreState) => ({
  type: SET_STATE,
  payload: state
})

export const a_setSettingsState = (state: SettingsState) => ({
  type: SET_SETTINGS_STATE,
  payload: state
})

export const a_setScheduleState = (state: ScheduleState) => ({
  type: SET_SCHEDULE_STATE,
  payload: state
})