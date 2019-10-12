import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Form, Button, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { ScheduleType, StoreState } from '../types'
import { _String } from 'data-type-ext'
import theme from '../theme.json'
import { Thunk, mapActionToProp } from '../redux/middleware/batched-thunk';
import { updateCrews } from '../redux/actions/crew-actions';

interface OwnProps {
  scheduleType: ScheduleType
}
interface StateProps {
  crews: Record<number, string>
}
interface DispatchProps {
  updateCrews: Thunk<typeof updateCrews>
}
interface State {
  crews: Record<number, string>
  newCrews: string[]
  validated: boolean
}
class CrewView extends Component<OwnProps & StateProps & DispatchProps, State> {
  constructor(props) {
    super(props)

    this.state = {
      crews: {...this.props.crews},
      newCrews: [],
      validated: false,
    }
    this.addCrew = this.addCrew.bind(this)
    this.updateCrew = this.updateNewCrew.bind(this)
    this.updateNewCrew = this.updateNewCrew.bind(this)
    this.deleteCrew = this.deleteCrew.bind(this)
    this.deleteNewCrew = this.deleteNewCrew.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  
  addCrew() {
    this.setState({ newCrews: [...this.state.newCrews, ''] })
  }

  updateCrew(e: React.ChangeEvent<HTMLInputElement>, crewID: number) {
    this.setState({ crews: { ...this.state.crews, [crewID]: e.target.value } })
  }

  updateNewCrew(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    let newCrews = [...this.state.newCrews]
    newCrews[i] = e.target.value
    this.setState({ newCrews })
  }

  deleteCrew(crewID: number) {
    let { [crewID]: deletedCrew, ...crews } = this.state.crews
    this.setState({ crews })
  }

  deleteNewCrew(i: number) {
    this.setState({ newCrews: this.state.newCrews.filter((c, idx) => idx !== i) })
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()
    if (!e.currentTarget.checkValidity()) {
      this.setState({ validated: true })
    } else {
      this.props.updateCrews(this.props.scheduleType, this.state.crews, this.state.newCrews)
    }

  }



  render() {
    console.log(this.state.crews)
    return (
      <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
        <Card >
          <Card.Header>
            {_String.spaceCamelCase(this.props.scheduleType)} Crews
            <div className="point" style={{ float: 'right' }} onClick={this.addCrew}>
              <FontAwesomeIcon icon={faPlus} color={theme.primary} />
            </div>
          </Card.Header>

          {Object.entries(this.state.crews).map(([crewID, crewName]) =>
            <InputGroup key={crewID}>
              <Form.Group style={{ marginBottom: 0 }}>
                <Form.Control type="text" placeholder="Crew Name" value={crewName} onChange={e => this.updateCrew(e, +crewID)} required/>
                <Form.Control.Feedback type="invalid">Please enter a Crew name</Form.Control.Feedback>
              </Form.Group>
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={() => this.deleteCrew(+crewID)}><FontAwesomeIcon icon={faTrashAlt} color='red' /></Button>
              </InputGroup.Append>
            </InputGroup>
          )}
          {this.state.newCrews.map((crewName, i) =>
            <InputGroup key={i}>
              <Form.Group style={{ marginBottom: 0 }}>
                <Form.Control type="text" placeholder="Crew Name" value={crewName} onChange={e => this.updateNewCrew(e, i)} required/>
                <Form.Control.Feedback type="invalid">Please enter a Crew name</Form.Control.Feedback>
              </Form.Group>
              <InputGroup.Append>
                <Button variant="outline-secondary" onClick={() => this.deleteNewCrew(i)}><FontAwesomeIcon icon={faTrashAlt} color='red' /></Button>
              </InputGroup.Append>
            </InputGroup>
          )}
        </Card>
        <Button type="submit" style={{ marginTop: '1rem'}}>Save Changes</Button>
      </Form>
    )
  }
}

const mapStateToProps = (state: StoreState, props: OwnProps) => ({
  crews: state.crews[props.scheduleType] || {}
})

const mapDispatchToProps = dispatch => ({
  updateCrews: mapActionToProp(updateCrews, dispatch),
})

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(CrewView)