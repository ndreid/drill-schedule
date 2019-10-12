import React, { Component } from 'react'
import './DrillingMetricsView.css'
import { OHDrillMetrics } from '../../types';

interface Props {
  metrics: OHDrillMetrics
  saveChanges: Function
}
interface State {
  metrics: OHDrillMetrics
  specTownshipAddDisabled: boolean
}

class DrillingMetricsViewOH extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      metrics: JSON.parse(JSON.stringify(this.props.metrics)),
      specTownshipAddDisabled: true
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTimingChange = this.handleTimingChange.bind(this)
    this.handleCostChange = this.handleCostChange.bind(this)
    this.handleSpecTownshipChange = this.handleSpecTownshipChange.bind(this)
    this.addTownship = this.addTownship.bind(this)
    this.removeTownship = this.removeTownship.bind(this)
  }
  formRef = React.createRef<HTMLFormElement>()
  townshipRef = React.createRef<HTMLInputElement>()
  regexNum = "^\\d{0,8}(\\.\\d{0,2})?$"

  componentDidUpdate(prevProps: Props) {
    if (this.props.metrics !== prevProps.metrics) {
      this.setState({ metrics: JSON.parse(JSON.stringify(this.props.metrics)) })
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    event.stopPropagation()

    if (this.formRef.current.checkValidity() === false) {
      this.formRef.current.classList.add('was-validated')
    } else {
      var metrics: OHDrillMetrics = Object.assign({}, this.state.metrics)
      metrics.timing.vertDuration = +metrics.timing.vertDuration
      metrics.timing.horzDuration = +metrics.timing.horzDuration
      metrics.timing.moveTime = +metrics.timing.moveTime
      metrics.costs.costPerFt = +metrics.costs.costPerFt
      metrics.costs.totalFixedCost = +metrics.costs.totalFixedCost
      metrics.costs.defVertFixedCost = +metrics.costs.defVertFixedCost
      metrics.costs.specifiedTownshipVertFixedCost = +metrics.costs.specifiedTownshipVertFixedCost
      this.props.saveChanges(metrics).then(() => {
        this.formRef.current.classList.remove('was-validated')
      })
    }
  }

  handleTimingChange(event) {
    var metrics: OHDrillMetrics = Object.assign({}, this.state.metrics)
    metrics.timing[event.target.id] = event.target.value
    this.setState({ metrics: metrics })
  }

  handleCostChange(event) {
    var metrics: OHDrillMetrics = Object.assign({}, this.state.metrics)
    metrics.costs[event.target.id] = event.target.value
    this.setState({ metrics: metrics })
  }

  handleSpecTownshipChange() {
    var disable = true
    if (this.townshipRef.current.value && !this.state.metrics.costs.specifiedTownships.includes(this.townshipRef.current.value.toUpperCase())) {
      disable = false
    }

    if (this.state.specTownshipAddDisabled !== disable) {
      this.setState({ specTownshipAddDisabled: !this.state.specTownshipAddDisabled })
    }
  }

  addTownship() {
    var metrics: OHDrillMetrics = Object.assign({}, this.state.metrics)
    metrics.costs.specifiedTownships.push(this.townshipRef.current.value.toUpperCase())
    this.townshipRef.current.value = ""
    this.setState({ specTownshipAddDisabled: true, metrics: metrics })
  }

  removeTownship(township: string) {
    var metrics: OHDrillMetrics = Object.assign({}, this.state.metrics)
    metrics.costs.specifiedTownships = this.state.metrics.costs.specifiedTownships.filter(t => t !== township)
    this.setState({ metrics: metrics })
  }

  render() {
    return (
      <form ref={this.formRef} autoComplete="off" noValidate onSubmit={this.handleSubmit} style={{ height: "calc(100% - 83px)", maxHeight: "calc(100% - 83px)"}}>
        <div className="fb-row-nowrap" style={{height: "100%", maxHeight: "100%"}}>
        
          {/* TIMING  */}
          <div className="fi-def" style={{maxWidth: "1000px", marginRight:16}}>
            <div className="card" style={{marginBottom:16}}>
              <div className="card-header"><b>Timing</b></div>
              <div className="card-body">

                {/* <div className="form-group row">
                  <label htmlFor="drillDepthThreshold" className="col-sm-3 col-form-label">Drill Depth Threshold</label>
                  <div className="input-group col-sm-9">
                    <input type="text" className="form-control" id="drillDepthThreshold" pattern={this.regexNum} value={this.state.metrics.timing.drillDepthThreshold} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">ft.</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="vertDurationOverThreshold" className="col-sm-3 col-form-label">TMD &gt; Threshold V</label>
                  <div className="input-group col-sm-9">
                    <input type="text" className="form-control" id="vertDurationOverThreshold" pattern={this.regexNum} value={this.state.metrics.timing.vertDurationOverThreshold} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="horzDurationOverThreshold" className="col-sm-3 col-form-label">TMD &gt; Threshold H</label>
                  <div className="input-group col-sm-9">
                    <input type="text" className="form-control" id="horzDurationOverThreshold" pattern={this.regexNum} value={this.state.metrics.timing.horzDurationOverThreshold} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="vertDurationUnderThreshold" className="col-sm-3 col-form-label">TMD &lt; Threshold V</label>
                  <div className="input-group col-sm-9">
                    <input type="text" className="form-control" id="vertDurationUnderThreshold" pattern={this.regexNum} value={this.state.metrics.timing.vertDurationUnderThreshold} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="horzDurationUnderThreshold" className="col-sm-3 col-form-label">TMD &lt; Threshold H</label>
                  <div className="input-group col-sm-9">
                    <input type="text" className="form-control" id="horzDurationUnderThreshold" pattern={this.regexNum} value={this.state.metrics.timing.horzDurationUnderThreshold} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div> */}

                <div className="form-group row">
                  <label htmlFor="vertDuration" className="col-sm-5 col-form-label">TMD &lt; Threshold V</label>
                  <div className="input-group col-sm-7">
                    <input type="text" className="form-control" id="vertDuration" pattern={this.regexNum} value={this.state.metrics.timing.vertDuration} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="horzDuration" className="col-sm-5 col-form-label">TMD &lt; Threshold H</label>
                  <div className="input-group col-sm-7">
                    <input type="text" className="form-control" id="horzDuration" pattern={this.regexNum} value={this.state.metrics.timing.horzDuration} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row" style={{marginBottom:0}}>
                  <label htmlFor="moveTime" className="col-sm-5 col-form-label">Move Time</label>
                  <div className="input-group col-sm-7">
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
          <div className="fi-def" style={{maxHeight: "100%", maxWidth: "700px"}}>
            <div className="card" style={{}}>
              <div className="card-header"><b>Costs</b></div>
              <div className="card-body" style={{maxHeight: "calc(100vh - 178.33px)"}}>
                <div className="form-group row">
                  <label htmlFor="costPerFt" className="col-sm-4 col-form-label">Lateral Length Cost</label>
                  <div className="input-group col-sm-8">
                    <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                    <input type="text" className="form-control" id="costPerFt" pattern={this.regexNum} value={this.state.metrics.costs.costPerFt} onChange={this.handleCostChange} required/>
                    <div className="input-group-append"><span className="input-group-text">per ft.</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="totalFixedCost" className="col-sm-4 col-form-label">Total Fixed Cost</label>
                  <div className="input-group col-sm-8">
                    <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                    <input type="text" className="form-control" id="totalFixedCost" pattern={this.regexNum} value={this.state.metrics.costs.totalFixedCost} onChange={this.handleCostChange} required/>
                    <div className="input-group-append"><span className="input-group-text">per Well</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="defVertFixedCost" className="col-sm-4 col-form-label">Default Vert Fixed Cost</label>
                  <div className="input-group col-sm-8">
                    <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                    <input type="text" className="form-control" id="defVertFixedCost" pattern={this.regexNum} value={this.state.metrics.costs.defVertFixedCost} onChange={this.handleCostChange} required/>
                    <div className="input-group-append"><span className="input-group-text">per Well</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="specifiedTownshipVertFixedCost" className="col-sm-4 col-form-label">Vert Fixed Cost for Spec. Townships</label>
                  <div className="input-group col-sm-8">
                    <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                    <input type="text" className="form-control" id="specifiedTownshipVertFixedCost" pattern={this.regexNum} value={this.state.metrics.costs.specifiedTownshipVertFixedCost} onChange={this.handleCostChange} required/>
                    <div className="input-group-append"><span className="input-group-text">per Well</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="card" style={{maxHeight: "calc(100vh - 390px", minHeight: 300}}>
                  <div className="card-header" >
                    <div className="form-group row" style={{marginBottom:0}}>
                      <label htmlFor="specTownshipInput" className="col-sm-4 col-form-label"><b>Specified Townships</b></label>
                      <div className="input-group col-sm-8">
                        <input ref={this.townshipRef} type="text" className="form-control" id="specTownshipInput" onChange={this.handleSpecTownshipChange}/>
                        <div className="input-group-append"><button className="btn btn-secondary" type="button" disabled={this.state.specTownshipAddDisabled} onClick={this.addTownship}>Add</button></div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body" style={{padding: "0", height: "calc(100% - 570px)"}}>
                    <ul className="list-group spec-townships" ref="specifiedTownships" style={{maxHeight: "calc(100vh - 450px)"}}>
                      {this.state.metrics.costs.specifiedTownships.sort((a, b) => {
                        var nameA = a.toUpperCase()
                        var nameB = b.toUpperCase()
                        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0
                      }).map(t => 
                        <li key={t} ref={t} className="list-group-item">{t}<span className="township-remove" onClick={() => this.removeTownship(t)}>x</span></li>
                      )}
                    </ul>
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

export default DrillingMetricsViewOH