import React, { Component } from 'react'
import { ConstructionMetrics } from '../../types';

interface Props {
  metrics: ConstructionMetrics
  saveChanges: Function
}
interface State {
  metrics: ConstructionMetrics
}

class PadConstructionMetricsView extends Component<Props, State> {
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
      var metrics: ConstructionMetrics = Object.assign({}, this.state.metrics)
      metrics.timing.defConstructionBeforeRigSpud = +metrics.timing.defConstructionBeforeRigSpud
      metrics.timing.defDuration = +metrics.timing.defDuration
      metrics.costs.initialCost.padCost = +metrics.costs.initialCost.padCost
      metrics.costs.initialCost.roadCost = +metrics.costs.initialCost.roadCost
      this.props.saveChanges(metrics).then(() => {
        this.formRef.current.classList.remove('was-validated')
      })
    }
  }

  handleTimingChange(event) {
    var metrics: ConstructionMetrics = Object.assign({}, this.state.metrics)
    metrics.timing[event.target.id] = event.target.value
    this.setState({ metrics: metrics })
  }

  handleCostChange(event) {
    var metrics: ConstructionMetrics = Object.assign({}, this.state.metrics)
    metrics.costs.initialCost[event.target.id] = event.target.value
    this.setState({ metrics: metrics })
  }

  render() {
    return (
      <form ref={this.formRef} autoComplete="off" noValidate onSubmit={this.handleSubmit} style={{ height: "max-content", maxHeight: "calc(100% - 83px)"}}>
        <div className="fb-row-nowrap" style={{height: "100%", maxHeight: "100%"}}>
        
          {/* TIMING  */}
          <div className="fi-def" style={{maxWidth: "700px", marginRight:16}}>
            <div className="card" style={{marginBottom: "16px"}}>
              <div className="card-header"><b>Timing</b></div>
              <div className="card-body">

                <div className="form-group row">
                  <label htmlFor="defConstructionBeforeRigSpud" className="col-sm-6 col-form-label">Default Pad Constr Before Rig Spud</label>
                  <div className="input-group col-sm-6">
                    <input type="text" className="form-control" id="defConstructionBeforeRigSpud" pattern={this.regexNum} value={this.state.metrics.timing.defConstructionBeforeRigSpud} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row" style={{marginBottom:0}}>
                  <label htmlFor="defDuration" className="col-sm-6 col-form-label">Default Duration</label>
                  <div className="input-group col-sm-6">
                    <input type="text" className="form-control" id="defDuration" pattern={this.regexNum} value={this.state.metrics.timing.defDuration} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* COSTS  */}
          <div className="fi-def" style={{height: "100%", maxHeight: "100%", maxWidth: "700px"}}>
            <div className="card" style={{maxHeight: "100%"}}>
              <div className="card-header"><b>Costs</b></div>
              <div className="card-body" style={{height: "100%", maxHeight: "calc(100vh - 178.33px)"}}>

                <div className="form-group row">
                  <label htmlFor="padCost" className="col-sm-4 col-form-label">Pad Costs</label>
                  <div className="input-group col-sm-8">
                    <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                    <input type="text" className="form-control" id="padCost" pattern={this.regexNum} value={this.state.metrics.costs.initialCost.padCost} onChange={this.handleCostChange} required/>
                    <div className="input-group-append"><span className="input-group-text">per Well</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row" style={{marginBottom:0}}>
                  <label htmlFor="roadCost" className="col-sm-4 col-form-label">Road Costs</label>
                  <div className="input-group col-sm-8">
                    <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                    <input type="text" className="form-control" id="roadCost" pattern={this.regexNum} value={this.state.metrics.costs.initialCost.roadCost} onChange={this.handleCostChange} required/>
                    <div className="input-group-append"><span className="input-group-text">per Well</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
        <button type="submit" className="btn btn-lg btn-gpor-primary"><b>Save Changes</b></button>
      </form>
    )
  }
}

export default PadConstructionMetricsView