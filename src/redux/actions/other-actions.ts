import { SET_SPINNER_VISIBILITY, SET_DIRTY, SET_PREVENT_DOCUMENT_SAVE } from '../action-types/other-action-types'
import { Dispatcher } from '../middleware/batched-thunk';
import { StoreState } from '../../types';

// DISPATCHERS

export const setSpinnerVisibility = (visible: boolean) => (dispatcher: Dispatcher, state: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setSpinnerVisibility(visible))
    dispatcher.batchAction(a_setDirty(state.dirty))
    resolve()
  })
)

export const setDirty = (dirty: boolean) => (dispatcher: Dispatcher) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setDirty(dirty))
    resolve()
  })
)

export const setPreventDocumentSave = (prevent: boolean) => (dispatcher: Dispatcher) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_setPreventDocumentSave(prevent))
    resolve()
  })
)

// ACTIONS
const a_setSpinnerVisibility = (visible: boolean) => ({
  type: SET_SPINNER_VISIBILITY,
  payload: visible
})

const a_setDirty = (dirty: boolean) => ({
  type: SET_DIRTY,
  payload: dirty
})

const a_setPreventDocumentSave = (prevent: boolean) => ({
  type: SET_PREVENT_DOCUMENT_SAVE,
  payload: prevent
})