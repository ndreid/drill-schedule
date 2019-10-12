import React from 'react'
import { Modal, Button } from 'react-bootstrap'

interface Props {
  title: string
  body: string
  onClose?: (response: 'y'|'n'|'x') => void
}
const BoolModal: React.FC<Props> = ({ title, body, onClose }) => {
  return (
    <Modal show onHide={() => onClose('x')}>
      <Modal.Header closeButton style={{ fontSize: 24 }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={() => onClose('y')}>Yes</Button>
        <Button variant='danger' onClick={() => onClose('n')}>No</Button>
        <Button variant='secondary' onClick={() => onClose('x')}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default BoolModal