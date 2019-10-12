import { cloneDeep } from 'lodash'
import { Action } from 'redux';


// export interface Dispatch<A extends Action = AnyAction> {
//   <T extends A>(action: T): T
// }
export interface Dispatcher {
  batchAction: (action: Action) => void
  dispatchSingle: (action: any) => Promise<any>//ReturnType<ThunkDispatch>
  dispatchMany: (actions: any[]) => Promise<any>
}

export interface ThunkDispatch {
  <T>(action: T, isOriginalAction?: boolean): T
}

export interface Thunk<T extends ((...args1: any) => (...args2: any) => any)> {
  (...args: Parameters<T>): ReturnType<ReturnType<T>>
}

export function mapActionToProp<A extends ((...args1: any) => (...args2: any) => any) | ((...args: any) => any)>(action: A, dispatch) {
  return (...args: Parameters<A>) => dispatch(action(...args))
}

const batchedThunk = ({dispatch, getState}: { dispatch: ThunkDispatch, getState: Function}) => {
  let batchedActions: Action[] = []
  let newState = undefined
  const dispatcher: Dispatcher = {
    batchAction: a => {
      batchedActions.push(a)
    },
    dispatchSingle: a => {
      return dispatch(a, false)
    },
    dispatchMany: actions => {
      return Promise.all(actions.map(a =>
        dispatch(a, false)  
      ))
    }
  }
  const dispatchBatch = () => {
    let actionObj = Object.assign({}, batchedActions) as Record<number, Action>
    actionObj['type'] = 'ARRAY'
    dispatch(actionObj, false)
    newState = undefined
    batchedActions.length = 0
  }

  return next => (action, isOriginalAction = true) => {
    if (typeof action === 'function') {
      if (!newState) {
        newState = cloneDeep(getState())
      }
      return action(dispatcher, newState).then(() => {
        if (isOriginalAction) {
          dispatchBatch()
        }
      })
    } else {
      return next(action)
    }
  }
}

export default batchedThunk