import React from 'react'
import { Modal, Button, Form, FormProps, FormControlProps } from 'react-bootstrap'
import { OpsSchedule } from '../../types';

type Props = {
  opsSchedules: OpsSchedule[]
  includeNewSchedule?: boolean
  cancellable?: boolean
  onClose?: (opsScheduleID?: number, opsScheduleName?: string) => void
}
type State = {
  validated: boolean
  selectedOpsScheduleID: number
  newOpsScheduleName: string
}
// type DefaultProps = Readonly<typeof defaultProps>
const defaultProps: Partial<Props> = {
  includeNewSchedule: false,
  cancellable: true,
}
class SelectOpsScheduleModal extends React.Component<Props, State> {
  static defaultProps = defaultProps
  constructor(props) {
    super(props)

    this.state = {
      validated: false,
      selectedOpsScheduleID: this.props.includeNewSchedule ? -1 : this.props.opsSchedules.length > 0 ? this.props.opsSchedules[0].opsScheduleID : undefined,
      newOpsScheduleName: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e: React.FormEvent<FormProps & FormControlProps>) {
    let { id, value } = e.currentTarget
    switch (id) {
      case 'id':
        this.setState({ selectedOpsScheduleID: +value })
        break
      case 'name':
        this.setState({ newOpsScheduleName: value })
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
      let args: any[] = [this.state.selectedOpsScheduleID]
      if (this.state.selectedOpsScheduleID === -1)
        args.push(this.state.newOpsScheduleName)
      this.props.onClose(...args)
    }
  }

  render() {
    return (
      <Modal show onHide={() => this.props.onClose()}>
        <Modal.Header closeButton={this.props.cancellable} style={{ fontSize: 24 }}>
          <Modal.Title>Select Ops Schedule</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
          <Modal.Body>
            <input style={{ display:'none' }} type="text" name="fakeusernameremembered"/>
            <input style={{ display:'none' }} type="password" name="fakepasswordremembered"/>
            <Form.Group>
              <Form.Label>Ops Schedule</Form.Label>
              <Form.Control id='id' as='select' onChange={this.handleChange} >
                {this.props.includeNewSchedule ? <option value={-1}>+ New Schedule</option> : null}
                {this.props.opsSchedules.map(os => 
                  <option key={os.opsScheduleID} value={os.opsScheduleID}>{os.opsScheduleName}</option>  
                )}
              </Form.Control>
            </Form.Group>
            {
              this.state.selectedOpsScheduleID === -1
                ? <Form.Group>
                    <Form.Label>New Ops Schedule Name</Form.Label>
                    <Form.Control id='name' type='text' value={this.state.newOpsScheduleName} placeholder='Ops Schedule Name' onChange={this.handleChange} required/>
                    <Form.Control.Feedback type="invalid">
                      Please provide an Ops Schedule Name
                    </Form.Control.Feedback>
                  </Form.Group>
                : null
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' type='submit'>OK</Button>
            {
              this.props.cancellable
                ? <Button variant='secondary' onClick={() => this.props.onClose()}>Cancel</Button>
                : null
            }
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }
}

export default SelectOpsScheduleModal