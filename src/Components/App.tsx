import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadOpsSchedules, selectOpsSchedule, createOpsScheduleFrom } from '../redux/actions/opsSchedule-actions'
import { selectView } from '../redux/actions/view-actions'
import { setSpinnerVisibility, setDirty } from '../redux/actions/other-actions'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import SplitPane from './SplitPane'
import ScheduleShell from './ScheduleShell'
import TimelineView from './TimelineView'
import TableView from './TableView/TableView'
import SummaryView from './SummaryView'
import MetricsView from './Metrics/MetricsView'
import LeftNav from './LeftNav'
import { OpsSchedule, OpsSchedules, StoreState, ScheduleType, ViewType } from '../types';
import { Thunk, mapActionToProp } from '../redux/middleware/batched-thunk';
import AFEView from './AFEView';
import CrewView from './CrewView';
import SourceDataView from './SourceDataView/SourceDataView';
import TopNav from './TopNav';
import Settings from './Settings';
import ModalContainer from './Modals/ModalContainer';
import { NewOpsScheduleModal, BoolModal } from './Modals'
import { openModal } from '../redux/actions/modal-actions';
import { selectStateCode } from '../redux/actions/stateCode-actions';
import ErrorHandler from './ErrorHandler';

interface OwnProps {
  loadedStateFromStorage: boolean
  initOpsScheduleID: number
}
interface StateProps {
  dirty: boolean
  spinnerVisible: boolean
  selectedViews: ViewType[]
  selectedScheduleTypes: ScheduleType[]
  selectedStateCode: string
  selectedOpsSchedule: OpsSchedule
  opsSchedules: OpsSchedules
}
interface DispatchProps {
  setDirty: Thunk<typeof setDirty>
  setSpinnerVisibility: Thunk<typeof setSpinnerVisibility>
  selectStateCode: Thunk<typeof selectStateCode>
  loadOpsSchedules: Thunk<typeof loadOpsSchedules>
  selectOpsSchedule: Thunk<typeof selectOpsSchedule>
  selectView: typeof selectView
  createOpsScheduleFrom: Thunk<typeof createOpsScheduleFrom>
  openModal: typeof openModal
}
interface State {
  displayMode: DisplayMode
  opsScheduleModalID: number
}
type DisplayMode = 'single' | 'splitVert' | 'splitHorz'

class App extends Component<OwnProps & StateProps & DispatchProps, State> {
  constructor(props) {
    super(props)

    this.state = {
      displayMode: 'single',
      opsScheduleModalID: undefined,
    }

    this.changeOpsSchedule = this.changeOpsSchedule.bind(this)
    this.changeDisplayMode = this.changeDisplayMode.bind(this)

    if (Object.keys(this.props.opsSchedules).length === 0) {
      this.getOpsSchedules()
    } else {
      this.props.setSpinnerVisibility(false)
    }
  }

  getOpsSchedules() {
    this.props.setSpinnerVisibility(true).then(() => {
      this.props.loadOpsSchedules()
      .then(() => {
        this.props.setSpinnerVisibility(false)
      })
    })
  }

  changeOpsSchedule(opsScheduleID: number) {
    if (this.props.selectedOpsSchedule && this.props.selectedOpsSchedule.opsScheduleID === opsScheduleID)
      return

    if (opsScheduleID === -1) {
      this.props.openModal(NewOpsScheduleModal, {
        opsSchedules: this.props.opsSchedules
      }, (opsScheduleName, srcOpsScheduleID, srcType) => {
        if (opsScheduleName) {
          this.props.createOpsScheduleFrom(opsScheduleName, srcOpsScheduleID, srcType).then((newOpsScheduleID) => {
            this.props.openModal(BoolModal, {
              title: 'Confirm',
              body: `Open newly created Ops Schedule '${opsScheduleName}?`
            }, (response) => {
              if (response === 'y')
                this.props.selectOpsSchedule(newOpsScheduleID)
            })
          })
        }
      })
    } else {
      this.props.setSpinnerVisibility(true).then(() =>
        this.props.selectOpsSchedule(opsScheduleID).then(() => {
          this.props.setSpinnerVisibility(false)
        })
      )
    }
  }

  changeDisplayMode(displayMode: DisplayMode) {
    if (this.state.displayMode !== displayMode) {
      this.setState({ displayMode: displayMode })
    }
  }

  getComponent(viewNum: number) {
    let viewType = this.props.selectedViews[viewNum]
    let scheduleType = this.props.selectedScheduleTypes[viewNum]
    console.log(viewNum, viewType, scheduleType)
    return (
      <div className='fb-row-nowrap' style={{width:'100%', height:'100%'}}>
        <LeftNav selectedView={this.props.selectedViews[viewNum]} selectView={(viewName: ViewType) => this.props.selectView(viewNum, viewName)}/>
        <div className="view" key={'view' + viewNum}>
        {
          viewType === ViewType.Timeline ?
            <ScheduleShell scheduleType={scheduleType} viewNum={viewNum}>
              <TimelineView scheduleType={scheduleType}/> 
            </ScheduleShell>
          : viewType === ViewType.Table ?
            <ScheduleShell scheduleType={scheduleType} viewNum={viewNum}>
              <TableView scheduleType={scheduleType} />
            </ScheduleShell>
          : viewType === ViewType.Summary ?
            <SummaryView />         
          : viewType === ViewType.Metrics ?
            <ScheduleShell scheduleType={scheduleType === ScheduleType.Lateral ? ScheduleType.Drill : scheduleType} hidePadSchedule viewNum={viewNum}>
              <MetricsView scheduleType={scheduleType === ScheduleType.Lateral ? ScheduleType.Drill : scheduleType} />
            </ScheduleShell>
          : viewType === ViewType.AFE ?
            <AFEView />
          : viewType === ViewType.Crew ?
            <ScheduleShell scheduleType={scheduleType === ScheduleType.Lateral ? ScheduleType.Drill : scheduleType} hidePadSchedule viewNum={viewNum}>
              <CrewView key={scheduleType === ScheduleType.Lateral ? ScheduleType.Drill : scheduleType} scheduleType={scheduleType === ScheduleType.Lateral ? ScheduleType.Drill : scheduleType}/>
            </ScheduleShell>
          : viewType === ViewType.SourceData ?
            <SourceDataView />
          : viewType === ViewType.Settings ?
            <Settings />
          : ""
        }
        </div>
      </div>
    )
  }

  render() {
    if (Object.keys(this.props.opsSchedules).length === 0) {
      return null
    }

    return (
      <ErrorHandler>
        <div style={{position:'absolute', height:'100vh', width:'100vw', background:'rgba( 255, 255, 255, .8 )', zIndex:9999}} hidden={!this.props.spinnerVisible}>
          <div className="spinner"></div>,
        </div>
        <div className="fb-col-nowrap">
          <TopNav
            stateCode={this.props.selectedStateCode}
            opsScheduleID={this.props.selectedOpsSchedule ? this.props.selectedOpsSchedule.opsScheduleID : undefined}
            opsSchedules={Object.values(this.props.opsSchedules)}
            displayMode={this.state.displayMode}
            onStateCodeChange={this.props.selectStateCode}
            onOpsScheduleChange={this.changeOpsSchedule}
            onDisplayModeChange={this.changeDisplayMode}
          />
          <div className="main fi-def">
            {this.props.selectedOpsSchedule ? (
              this.state.displayMode === 'single' ? (
                this.getComponent(0) 
              )
              : this.state.displayMode === 'splitVert' ? (
                <SplitPane key='vert' split='vertical' minSize={200} maxSize={-200} defaultSize="50%" allowResize style={{flex: '1 1 100%', position: 'static'}}>
                  { this.getComponent(0) }
                  { this.getComponent(1) }
                </SplitPane>
              )
              : this.state.displayMode === 'splitHorz' ? (
                <SplitPane key='horz' split='horizontal' minSize={100} maxSize={-100} defaultSize="50%" allowResize style={{flex: '1 1 100%', position: 'static'}}>
                  { this.getComponent(0) }
                  { this.getComponent(1) }
                </SplitPane>
              )
              : ''
            ) : ''
            }
          </div>
        </div>
        <ModalContainer />
      </ErrorHandler>
    )
  }
}

const mapStateToProps = (state: StoreState) => ({
  dirty: state.dirty,
  opsSchedules: state.opsSchedules,
  selectedStateCode: state.selectedStateCode,
  selectedOpsSchedule: state.opsSchedules[state.selectedOpsScheduleID],
  selectedScheduleTypes: state.selectedScheduleTypes,
  selectedViews: state.selectedViews,
  spinnerVisible: state.spinnerVisible,
})

const mapDispatchToProps = dispatch => ({
  setDirty: mapActionToProp(setDirty, dispatch),
  setSpinnerVisibility: mapActionToProp(setSpinnerVisibility, dispatch),
  selectStateCode: mapActionToProp(selectStateCode, dispatch),
  loadOpsSchedules: mapActionToProp(loadOpsSchedules, dispatch),
  selectOpsSchedule: mapActionToProp(selectOpsSchedule, dispatch),
  selectView: mapActionToProp(selectView, dispatch),
  createOpsScheduleFrom: mapActionToProp(createOpsScheduleFrom, dispatch),
  openModal: mapActionToProp(openModal, dispatch)
})

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(App);
