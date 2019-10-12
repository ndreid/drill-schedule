export const SELECT_STATE_CODE = 'SELECT_STATE_CODE'
interface SelectStateCodeAction {
  type: typeof SELECT_STATE_CODE
  payload: string
}

export type StateCodeActionType = SelectStateCodeAction