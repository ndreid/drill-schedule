import React, { Component } from 'react'
import { Modal, Button, Form, FormControl, FormControlProps } from 'react-bootstrap';
import { _String } from 'data-type-ext'
import { OpsSchedules } from '../../types';

interface Props {
  opsSchedules: OpsSchedules
  onClose?: (opsScheduleName?: string, srcOpsScheduleID?: number, srcName?: 'app' | 'smartsheet') => void
}
interface State {
  opsScheduleName: string
  baseSource: 'app' | 'smartsheet'
  baseScheduleID: number
  validated: boolean
}
class NewOpsScheduleModal extends Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      opsScheduleName: '',
      baseSource: 'app',
      baseScheduleID: this.getDefaultBaseScheduleID('app'),
      validated: false,
    }

    console.log(this.state.baseScheduleID)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  smartsheetSources = [0,1,2,3,4,5,6,7,8]

  getDefaultBaseScheduleID(baseSource: string) {
    return baseSource === 'app'
      ? Object.values(this.props.opsSchedules)[0].opsScheduleID
      : this.smartsheetSources[0]
  }

  handleChange(e: React.FormEvent<FormControl & FormControlProps>) {
    let { id, value } = e.currentTarget
    switch (id) {
      case 'name':
        this.setState({ opsScheduleName: value })
        break
      case 'base-source':
        this.setState({
          baseSource: value as 'app' | 'smartsheet',
          baseScheduleID: this.getDefaultBaseScheduleID(value) 
        })
        break
      case 'base':
        this.setState({ baseScheduleID: +value })
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
      this.props.onClose(this.state.opsScheduleName, this.state.baseScheduleID, this.state.baseSource)
    }
  }

  render() {
    let baseScheduleOptions = this.state.baseSource === 'app'
      ? Object.values(this.props.opsSchedules).map(os => 
          <option key={os.opsScheduleID} value={os.opsScheduleID}>{os.opsScheduleName}</option>
        )
      : this.smartsheetSources.map(ss =>
          <option key={ss} value={ss}>{ss}</option>
        )

    return (
      <Modal show onHide={() => this.props.onClose()}>
        <Modal.Header closeButton style={{ fontSize: 24 }}>
          <Modal.Title>New Ops Schedule</Modal.Title>
        </Modal.Header>
        <Form validated={this.state.validated} noValidate onSubmit={this.handleSubmit}>
          <Modal.Body>
              <input style={{ display:'none' }} type="text" name="fakeusernameremembered"/>
              <input style={{ display:'none' }} type="password" name="fakepasswordremembered"/>
              <Form.Group>
                <Form.Label>Ops Schedule Name</Form.Label>
                <Form.Control id='name' type='text' value={this.state.opsScheduleName} onChange={this.handleChange} required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Base Source</Form.Label>
                <Form.Control id='base-source' as='select' value={this.state.baseSource} onChange={this.handleChange}>
                  <option value='app'>Web App</option>
                  <option value='smartsheet'>Smartsheet</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Base Schedule</Form.Label>
                <Form.Control
                  id='base'
                  as='select'
                  value={this.state.baseSource === 'app' ? this.props.opsSchedules[this.state.baseScheduleID].opsScheduleName : ''+this.state.baseScheduleID}
                  onChange={this.handleChange}
                >
                  {baseScheduleOptions}
                </Form.Control>
              </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' type='submit'>Save</Button>
            <Button variant='secondary' onClick={() => this.props.onClose()}>Cancel</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}

export default NewOpsScheduleModal