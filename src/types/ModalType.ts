import { ComponentType } from 'react';
import * as Modals from '../Components/Modals'

export const ModalType: Record<ModalTypeName, ModalType> = Object.freeze({
  ...Modals
})

export type ModalTypeName = keyof typeof Modals
export type ModalType = ComponentType<{
  onClose?: (...any) => void
}>