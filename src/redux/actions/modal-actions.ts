import React from 'react'
import { OPEN_MODAL, CLOSE_MODAL, ModalActionType } from '../action-types/modal-action-types'
import { ModalType, ModalTypeName, StoreState } from '../../types'
import { Dispatcher } from '../middleware/batched-thunk';

// DISPATCHERS

export const openModal = <M extends ModalType>(modal: M, props: React.ComponentProps<M>, callback?: React.ComponentProps<M>['onClose']): ModalActionType => {
  let modalType = Object.entries(ModalType).find(([_,m]) => m === modal)[0] as ModalTypeName
  return {
    type: OPEN_MODAL,
    payload: {
      type: modalType,
      props,
      callback,
    }
  }
}

export const closeModal = () => (dispatcher: Dispatcher, state: StoreState) => (
  new Promise((resolve, reject) => {
    dispatcher.batchAction(a_closeModal)
    resolve()
  })
)
const a_closeModal = {
  type: CLOSE_MODAL
}