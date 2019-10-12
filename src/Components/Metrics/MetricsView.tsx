import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setScheduleMetrics } from '../../redux/actions/metrics-actions'
import { setSpinnerVisibility } from '../../redux/actions/other-actions'
import './MetricsView.css'
import PadConstructionMetricsView from './ConstructionMetricsView'
import DrillingMetricsViewOH from './DrillingMetricsView_OH'
import DrillingMetricsViewOK from './DrillingMetricsView_OK'
import FracMetricsView from './FracMetricsView'
import DrillOutMetricsView from './DrillOutMetricsView'
import FacilitiesMetricsView from './FacilitiesMetricsView'
import FlowbackMetricsView from './FlowbackMetricsView'
import Modal from '../Modal'
import { ScheduleType, Metrics, StoreState, OHDrillMetrics, OKDrillMetrics, ScheduleMetricsBase } from '../../types';
import { Thunk, mapActionToProp } from '../../redux/middleware/batched-thunk';

interface OwnProps {
  scheduleType: ScheduleType
}
interface StateProps {
  stateCode: string
  metrics: Metrics
}
interface DispatchProps {
  setScheduleMetrics: Thunk<typeof setScheduleMetrics>
  setSpinnerVisibility: Thunk<typeof setSpinnerVisibility>
}
interface State {
  showModal: boolean
}

class MetricsView extends Component<OwnProps & StateProps & DispatchProps, State> {
  constructor(props) {
    super(props)

    this.state = {
      showModal: false
    }

    this.saveChanges = this.saveChanges.bind(this)
  }

  getMetricsContent() {
    switch (this.props.scheduleType) {
      case ScheduleType.Construction: return <PadConstructionMetricsView key="content" metrics={this.props.metrics.construction} saveChanges={this.saveChanges}/>
      case ScheduleType.Drill: return ( this.props.stateCode === 'OH'
        ? <DrillingMetricsViewOH key="content" metrics={this.props.metrics.drill as OHDrillMetrics} saveChanges={this.saveChanges}/>
        : <DrillingMetricsViewOK key="content" metrics={this.props.metrics.drill as OKDrillMetrics} saveChanges={this.saveChanges}/>
      )
      case ScheduleType.Frac: return <FracMetricsView key="content" metrics={this.props.metrics.frac} saveChanges={this.saveChanges}/>
      case ScheduleType.DrillOut: return <DrillOutMetricsView key="content" metrics={this.props.metrics.drillOut} saveChanges={this.saveChanges}/>
      case ScheduleType.Facilities: return <FacilitiesMetricsView key="content" metrics={this.props.metrics.facilities} saveChanges={this.saveChanges}/>
      case ScheduleType.Flowback: return <FlowbackMetricsView key="content" metrics={this.props.metrics.flowback} saveChanges={this.saveChanges}/>
      default: throw new Error("MetricsView.jsx getMetricsContent() is not configured to handle ScheduleType " + this.props.scheduleType)
    }
  }

  saveChanges(scheduleMetrics: ScheduleMetricsBase) {
    return new Promise((resolve, reject) => {
      this.props.setSpinnerVisibility(true).then(() => {
        setTimeout(() => {
          this.props.setScheduleMetrics(this.props.scheduleType, scheduleMetrics).then(() => {
            this.props.setSpinnerVisibility(false).then(resolve)
            this.setState({ showModal: true }, () => {
              this.setState({ showModal: false })
            })
          })
        }, 1)
      })
    })
  }

  render() {
    return [
      <Modal key="modal" title="Metrics" message="Saved changes successfully." show={this.state.showModal}></Modal>,
      this.getMetricsContent()
    ]
  }
}

const mapStateToProps = (state: StoreState) => ({
  stateCode: state.selectedStateCode,
  metrics: state.metrics
})

const mapDispatchToProps = dispatch => ({
  setScheduleMetrics: mapActionToProp(setScheduleMetrics, dispatch),
  setSpinnerVisibility: mapActionToProp(setSpinnerVisibility, dispatch),
})

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(MetricsView)
