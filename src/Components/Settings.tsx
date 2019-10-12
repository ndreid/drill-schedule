import React from 'react'
import { connect } from 'react-redux'
import { setOpsScheduleName, saveOpsSchedule, saveOpsScheduleAs, saveOpsScheduleTo, copyOpsScheduleFrom, selectOpsSchedule, deleteOpsSchedule } from '../redux/actions/opsSchedule-actions'
import { Button, InputGroup, FormControl, FormControlProps } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faSave, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import theme from '../theme.json'
import { OpsSchedule, StoreState } from '../types/index.js';
import { Thunk, mapActionToProp } from '../redux/middleware/batched-thunk';
import { openModal } from '../redux/actions/modal-actions';
import { BoolModal, SelectOpsScheduleModal, SelectOpsScheduleSourceModal } from './Modals';

interface StateProps {
  dirty: boolean
  opsSchedule: OpsSchedule
  opsSchedules: OpsSchedule[]
}
interface DispatchProps {
  setOpsScheduleName: Thunk<typeof setOpsScheduleName>
  openModal: typeof openModal
  saveOpsSchedule: Thunk<typeof saveOpsSchedule>
  saveOpsScheduleAs: Thunk<typeof saveOpsScheduleAs>
  saveOpsScheduleTo: Thunk<typeof saveOpsScheduleTo>
  copyOpsScheduleFrom: Thunk<typeof copyOpsScheduleFrom>
  deleteOpsSchedule: Thunk<typeof deleteOpsSchedule>
  selectOpsSchedule: Thunk<typeof selectOpsSchedule>
}
interface State {
  editName: boolean
  opsScheduleName: string
}

class Settings extends React.Component<StateProps & DispatchProps, State> {
  constructor(props) {
    super(props)

    this.state = {
      editName: false,
      opsScheduleName: this.props.opsSchedule.opsScheduleName,
    }

    this.handeEditNameAction = this.handeEditNameAction.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
    this.handleSaveAsClick = this.handleSaveAsClick.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }
  handeEditNameAction(action: 'edit'|'save'|'cancel') {
    if (action === 'save' && this.state.opsScheduleName !== '')
      this.props.setOpsScheduleName(this.props.opsSchedule.opsScheduleID, this.state.opsScheduleName)
    else if (action === 'cancel') {
      this.setState({ editName: false, opsScheduleName: this.props.opsSchedule.opsScheduleName })
      return
    }
    this.setState({ editName: action === 'edit' ? true : false })
  }

  handleNameChange(e: React.FormEvent<FormControlProps>) {
    this.setState({ opsScheduleName: e.currentTarget.value })
  }

  handleSaveClick() {
    this.props.openModal(BoolModal, {
      title: 'Save Changes?',
      body: 'Save changes to the database?'
    }, (response) => {
      if (response === 'y') {
        this.props.saveOpsSchedule()
      }
    })
  }

  handleSaveAsClick() {
    this.props.openModal(SelectOpsScheduleModal, {
      opsSchedules: this.props.opsSchedules,
      includeNewSchedule: true,
    }, (opsScheduleID: number, opsScheduleName?: string) => {
      if (opsScheduleID === -1) {
        this.props.saveOpsScheduleAs(opsScheduleName).then(opsScheduleID => {
          this.props.openModal(BoolModal, {
            title: 'Confirm',
            body: `Do you want to open newly created Ops Schedule '${opsScheduleName}'?`
          }, response => {
            if (response === 'y')
              this.props.selectOpsSchedule(opsScheduleID)
          })
        }

        )
      } else if (opsScheduleID > -1) {
        this.props.saveOpsScheduleTo(opsScheduleID).then(() => {
          this.props.openModal(BoolModal, {
            title: 'Confirm',
            body: `Do you want to open Ops Schedule '${this.props.opsSchedules.find(os => os.opsScheduleID === opsScheduleID).opsScheduleName}'?`
          }, response => {
            if (response === 'y')
              this.props.selectOpsSchedule(opsScheduleID)
          })
        })
      }
    })
  }

  handleCopyFromClick() {
    this.props.openModal(SelectOpsScheduleSourceModal, {
      opsSchedules: this.props.opsSchedules
    }, (srcOpsScheduleID, srcType) => {
      if (srcType === 'app' || srcType === 'smartsheet') {
        console.error('NEED TO FINSHED CODING COPY FROM')
        // this.props.copyOpsScheduleFrom(srcOpsScheduleID, srcType)
      }
    })
  }

  handleDeleteClick() {
    let os = this.props.opsSchedule
    this.props.openModal(BoolModal, {
      title: 'Confirm',
      body: `Are you sure you want to permanently delete Ops Schedule '${os.opsScheduleName}'?`
    }, response => {
      if (response === 'y')
        this.props.deleteOpsSchedule(this.props.opsSchedule.opsScheduleID)
    })
  }

  render() {
    return (
      <div className='fb-col-nowrap' style={{ alignItems: 'flex-start'}}>
        <label htmlFor='ops-schedule-name'>Ops Schedule Name</label>
        <InputGroup>
          <FormControl isInvalid={this.state.opsScheduleName === ''} style={{ maxWidth: '16rem'}} id='ops-schedule-name' placeholder='Ops Schedule Name' disabled={!this.state.editName} value={this.state.opsScheduleName} onChange={this.handleNameChange} required/>
          <InputGroup.Append>
            <InputGroup.Text className='point' onClick={() => this.handeEditNameAction(this.state.editName ? 'save' : 'edit')}>
              <FontAwesomeIcon icon={this.state.editName ? faSave : faPencilAlt} color={theme.primary} style={{ fontSize: '1.3em' }}/>
            </InputGroup.Text>
          </InputGroup.Append>
          {this.state.editName
            ? <InputGroup.Append>
                <InputGroup.Text className='point' onClick={() => this.handeEditNameAction('cancel')}>
                  <FontAwesomeIcon icon={faTimesCircle} color={theme.primary} style={{ fontSize: '1.3em' }}/>
                </InputGroup.Text>
              </InputGroup.Append>
            : null
          }
        </InputGroup>
        <Button variant='success' style={{ marginTop: '1rem' }} onClick={this.handleSaveClick} disabled={!this.props.dirty}>Save</Button>
        <Button variant='secondary' style={{ marginTop: '1rem' }} onClick={this.handleSaveAsClick}>Save As...</Button>
        <Button variant='secondary' style={{ marginTop: '1rem' }} onClick={this.handleCopyFromClick} disabled>Copy From...</Button>
        <Button variant='danger' style={{ marginTop: '1rem' }} onClick={this.handleDeleteClick} disabled={this.props.opsSchedule.opsScheduleName === 'Public'}>DELETE</Button>
      </div>
    )
  }
}

const mapStateToProps = (state: StoreState) => ({
  dirty: state.dirty,
  opsSchedule: state.opsSchedules[state.selectedOpsScheduleID],
  opsSchedules: Object.values(state.opsSchedules).filter(os => os.opsScheduleID !== state.selectedOpsScheduleID),
})

const mapDispatchToProps = dispatch => ({
  setOpsScheduleName: mapActionToProp(setOpsScheduleName, dispatch),
  openModal: mapActionToProp(openModal, dispatch),
  saveOpsSchedule: mapActionToProp(saveOpsSchedule, dispatch),
  saveOpsScheduleAs: mapActionToProp(saveOpsScheduleAs, dispatch),
  saveOpsScheduleTo: mapActionToProp(saveOpsScheduleTo, dispatch),
  copyOpsScheduleFrom: mapActionToProp(copyOpsScheduleFrom, dispatch),
  deleteOpsSchedule: mapActionToProp(deleteOpsSchedule, dispatch),
  selectOpsSchedule: mapActionToProp(selectOpsSchedule, dispatch),
})

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(Settings)