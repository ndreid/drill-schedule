import { ModalType, ModalTypeName } from "../../types";

export const OPEN_MODAL = 'OPEN_MODAL'
interface OpenModalAction<MT extends ModalType> {
  type: typeof OPEN_MODAL
  payload: {
    type: ModalTypeName
    props: React.ComponentProps<MT>
    callback?: React.ComponentProps<MT>['onClose']
  }
}

export const CLOSE_MODAL = 'CLOSE_MODAL'
interface CloseModalAction {
  type: typeof CLOSE_MODAL
}

export type ModalActionType = OpenModalAction<ModalType> | CloseModalAction

