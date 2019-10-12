

export const SET_SPINNER_VISIBILITY = 'SET_SPINNER_VISIBILITY'
interface SetSpinnerVisibilityAction {
  type: typeof SET_SPINNER_VISIBILITY
  payload: boolean
}

export const SET_DIRTY = 'SET_DIRTY'
interface SetDirtyAction {
  type: typeof SET_DIRTY
  payload: boolean
}

export const SET_PREVENT_DOCUMENT_SAVE = 'SET_PREVENT_DOCUMENT_SAVE'
interface SetPreventDocumentSave {
  type: typeof SET_PREVENT_DOCUMENT_SAVE
  payload: boolean
}

export type OtherActionTypes = SetSpinnerVisibilityAction | SetDirtyAction | SetPreventDocumentSave