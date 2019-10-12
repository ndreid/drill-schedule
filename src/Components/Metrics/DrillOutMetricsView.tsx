import React, { Component } from 'react'
import { DrillOutMetrics } from '../../types';

interface Props {
  metrics: DrillOutMetrics
  saveChanges: Function
}
interface State {
  metrics: DrillOutMetrics
}

class DrillOutMetricsView extends Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      metrics: JSON.parse(JSON.stringify(this.props.metrics))
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTimingChange = this.handleTimingChange.bind(this)
    this.handleCostChange = this.handleCostChange.bind(this)
  }
  formRef = React.createRef<HTMLFormElement>()
  regexNum = "^\\d{0,8}(\\.\\d{0,2})?$"

  handleSubmit(event) {
    event.preventDefault()
    event.stopPropagation()

    if (this.formRef.current.checkValidity() === false) {
      this.formRef.current.classList.add('was-validated')
    } else {
      var metrics: DrillOutMetrics = Object.assign({}, this.state.metrics)
      metrics.timing.defFracToDrillOut = +metrics.timing.defFracToDrillOut
      metrics.timing.defDuration = +metrics.timing.defDuration
      metrics.timing.moveTime = +metrics.timing.moveTime
      metrics.costs.fixedCosts = +metrics.costs.fixedCosts
      this.props.saveChanges(metrics).then(() => {
        this.formRef.current.classList.remove('was-validated')
      })
    }
  }

  handleTimingChange(event) {
    var metrics: DrillOutMetrics = Object.assign({}, this.state.metrics)
    metrics.timing[event.target.id] = event.target.value
    this.setState({ metrics: metrics })
  }

  handleCostChange(event) {
    var metrics: DrillOutMetrics = Object.assign({}, this.state.metrics)
    metrics.costs[event.target.id] = event.target.value
    this.setState({ metrics: metrics })
  }

  render() {
    return (
      <form ref={this.formRef} autoComplete="off" noValidate onSubmit={this.handleSubmit} style={{ height: "calc(100% - 83px)", maxHeight: "calc(100% - 83px)"}}>
        <div className="fb-row-nowrap" style={{height: "100%", maxHeight: "100%"}}>
        
          {/* TIMING  */}
          <div className="fi-def" style={{maxWidth: "700px", marginRight:16}}>
            <div className="card" style={{marginBottom: "16px"}}>
              <div className="card-header"><b>Timing</b></div>
              <div className="card-body">

                <div className="form-group row">
                  <label htmlFor="defFracToDrillOut" className="col-sm-4 col-form-label">Default Frac to Drill Out</label>
                  <div className="input-group col-sm-8">
                    <input type="text" className="form-control" id="defFracToDrillOut" pattern={this.regexNum} value={this.state.metrics.timing.defFracToDrillOut} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="defDuration" className="col-sm-4 col-form-label">Default Duration</label>
                  <div className="input-group col-sm-8">
                    <input type="text" className="form-control" id="defDuration" pattern={this.regexNum} value={this.state.metrics.timing.defDuration} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row" style={{marginBottom:0}}>
                  <label htmlFor="moveTime" className="col-sm-4 col-form-label">Move Time</label>
                  <div className="input-group col-sm-8">
                    <input type="text" className="form-control" id="moveTime" pattern={this.regexNum} value={this.state.metrics.timing.moveTime} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

              </div>
            </div>
            <button type="submit" className="btn btn-lg btn-gpor-primary"><b>Save Changes</b></button>
          </div>

          {/* COSTS  */}
          <div className="fi-def" style={{height: "100%", maxHeight: "100%", maxWidth: "700px"}}>
            <div className="card" style={{maxHeight: "100%"}}>
              <div className="card-header"><b>Costs</b></div>
              <div className="card-body" style={{height: "100%", maxHeight: "calc(100vh - 178.33px)"}}>

                <div className="form-group row" style={{marginBottom:0}}>
                  <label htmlFor="fixedCosts" className="col-sm-4 col-form-label">Fixed Costs</label>
                  <div className="input-group col-sm-8">
                    <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                    <input type="text" className="form-control" id="fixedCosts" pattern={this.regexNum} value={this.state.metrics.costs.fixedCosts} onChange={this.handleCostChange} required/>
                    <div className="input-group-append"><span className="input-group-text">per Well</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </form>
    )
  }
}

export default DrillOutMetricsView