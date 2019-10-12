import React, { Component } from 'react'
import { Modal, Button, Form, FormControl, FormControlProps } from 'react-bootstrap';
import { _String } from 'data-type-ext'
import { OpsSchedules } from '../../types';

interface Props {
  opsSchedules: OpsSchedules
  onClose?: (srcOpsScheduleID?: number, srcType?: 'app' | 'smartsheet') => void
}
interface State {
  opsScheduleName: string
  sourceType: 'app' | 'smartsheet'
  sourceScheduleID: number
  validated: boolean
}
class SelectOpsScheduleSourceModal extends Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      opsScheduleName: '',
      sourceType: 'app',
      sourceScheduleID: this.getDefaultSourceScheduleID('app'),
      validated: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  smartsheetSources = [0,1,2,3,4,5,6,7,8]

  getDefaultSourceScheduleID(sourceType: string) {
    return sourceType === 'app'
      ? Object.values(this.props.opsSchedules)[0].opsScheduleID
      : this.smartsheetSources[0]
  }

  handleChange(e: React.FormEvent<FormControl & FormControlProps>) {
    let { id, value } = e.currentTarget
    switch (id) {
      case 'name':
        this.setState({ opsScheduleName: value })
        break
      case 'source-type':
        this.setState({
          sourceType: value as 'app' | 'smartsheet',
          sourceScheduleID: this.getDefaultSourceScheduleID(value) 
        })
        break
      case 'source':
        this.setState({ sourceScheduleID: +value })
        break
    }
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    let form = e.currentTarget as HTMLFormElement

    if (!form.checkValidity()) {
      this.setState({ validated: true })
    } else {
      this.props.onClose(this.state.sourceScheduleID, this.state.sourceType)
    }
  }

  render() {
    let sourceScheduleOptions = this.state.sourceType === 'app'
      ? Object.values(this.props.opsSchedules).map(os => 
          <option key={os.opsScheduleID} value={os.opsScheduleID}>{os.opsScheduleName}</option>
        )
      : this.smartsheetSources.map(ss =>
          <option key={ss} value={ss}>{ss}</option>
        )

    return (
      <Modal show onHide={() => this.props.onClose()}>
        <Modal.Header closeButton style={{ fontSize: 24 }}>
          <Modal.Title>Ops Schedule Source</Modal.Title>
        </Modal.Header>
        <Form validated={this.state.validated} noValidate onSubmit={this.handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Source Type</Form.Label>
              <Form.Control id='source-type' as='select' value={this.state.sourceType} onChange={this.handleChange}>
                <option value='app'>Web App</option>
                <option value='smartsheet'>Smartsheet</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Source Schedule</Form.Label>
              <Form.Control
                id='source'
                as='select'
                value={this.state.sourceType === 'app' ? this.props.opsSchedules[this.state.sourceScheduleID].opsScheduleName : ''+this.state.sourceScheduleID}
                onChange={this.handleChange}
              >
                {sourceScheduleOptions}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' type='submit'>OK</Button>
            <Button variant='secondary' onClick={() => this.props.onClose()}>Cancel</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}

export default SelectOpsScheduleSourceModal