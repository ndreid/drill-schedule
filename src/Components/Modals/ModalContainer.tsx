import React from 'react'
import { connect } from 'react-redux'
import { StoreState, ModalType } from '../../types';
import { closeModal } from '../../redux/actions/modal-actions'
import { mapActionToProp } from '../../redux/middleware/batched-thunk';

interface StateProps {
  modal: StoreState['modal']
}
interface DispatchProps {
  closeModal: typeof closeModal
}

const ModalContainer: React.FC<StateProps & DispatchProps> = ({ modal, closeModal }) => {
  const handleClose = (...args) => {
    if (modal.callback)
      modal.callback(...args)
    closeModal()
  }
  if (!modal)
    return null
  const Modal = ModalType[modal.type]
  const props = modal.props
  return (
    <Modal {...props} onClose={handleClose}/>
  )
}

const mapStateToProps = (state: StoreState) => ({
  modal: state.modal
})

const mapDispatchToProps = dispatch => ({
  closeModal: mapActionToProp(closeModal, dispatch)
})
export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(ModalContainer)