import { ViewType } from '../../types'

export const SELECT_VIEW = 'SELECT_VIEW'
interface SelectViewAction {
  type: typeof SELECT_VIEW
  payload: {
    viewNum: number
    viewName: ViewType
  }
}

export type ViewActionTypes = SelectViewAction