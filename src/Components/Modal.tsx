import React, { Component } from 'react'
import './Modal.css'

interface Props {
  title: string
  message: string
  show: boolean
}

class Modal extends Component<Props> {
  modalRef = React.createRef<HTMLDivElement>()
  componentWillReceiveProps(nextProps) {
    if (nextProps.show === true) {
      this.modalRef.current.setAttribute('show', 'true')
      // $('#modal').modal('show')
    }
  }

  render() {
    return (
      <div ref={this.modalRef} className="modal fade" id="modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header" style={{backgroundColor: "#001f44", color: "white"}}>
              <h5 className="modal-title" id="exampleModalLabel">{this.props.title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {this.props.message}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Modal