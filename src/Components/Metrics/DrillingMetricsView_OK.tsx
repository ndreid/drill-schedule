import React, { Component } from 'react'
import './DrillingMetricsView.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { OKDrillMetrics } from '../../types';

interface Props {
  metrics: OKDrillMetrics
  saveChanges: Function
}
interface State {
  metrics: OKDrillMetrics
  timingFormationAddDisabled: boolean
  costsFormationAddDisabled: boolean
}

class DrillingMetricsViewOK extends Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      metrics: JSON.parse(JSON.stringify(this.props.metrics)),
      timingFormationAddDisabled: true,
      costsFormationAddDisabled: true,
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTimingChange = this.handleTimingChange.bind(this)
    this.handleCostChange = this.handleCostChange.bind(this)
    this.handleFormationChange = this.handleFormationChange.bind(this)
    this.addFormation = this.addFormation.bind(this)
    this.deleteFormation = this.deleteFormation.bind(this)
  }
  formRef = React.createRef<HTMLFormElement>()
  timingRef = React.createRef<HTMLInputElement>()
  costsRef = React.createRef<HTMLInputElement>()
  regexNum = "^\\d{0,8}(\\.\\d{0,2})?$"
  regexNumNeg = "^-?\\d{0,8}(\\.\\d{0,2})?$"

  componentDidUpdate(prevProps) {
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
      var metrics: OKDrillMetrics = Object.assign({}, this.state.metrics)
      metrics.timing.moveTime = +metrics.timing.moveTime
      metrics.costs.moveCost = +metrics.costs.moveCost

      for (let f of Object.keys(metrics.timing.formations)) {
        metrics.timing.formations[f].vertDuration = +metrics.timing.formations[f].vertDuration
        metrics.timing.formations[f].horzDuration = +metrics.timing.formations[f].horzDuration
      }

      for (let f of Object.keys(metrics.costs.formations)) {
        metrics.costs.formations[f].vertTvdDiff = +metrics.costs.formations[f].vertTvdDiff
        metrics.costs.formations[f].horzLatLengthDiff = +metrics.costs.formations[f].horzLatLengthDiff
        metrics.costs.formations[f].vertCostPerFt = +metrics.costs.formations[f].vertCostPerFt
        metrics.costs.formations[f].horzCostPerFt = +metrics.costs.formations[f].horzCostPerFt
      }

      this.props.saveChanges(metrics).then(() => {
        this.formRef.current.classList.remove('was-validated')
      })
    }
  }

  handleTimingChange(event) {
    var metrics: OKDrillMetrics = Object.assign({}, this.state.metrics)
    metrics.timing[event.target.id] = event.target.value
    this.setState({ metrics: metrics })
  }

  handleCostChange(event) {
    var metrics: OKDrillMetrics = Object.assign({}, this.state.metrics)
    metrics.costs[event.target.id] = event.target.value
    this.setState({ metrics: metrics })
  }

  handleFormationChange(metricType: string) {
    let disable = true
    let ref = metricType === 'timing' ? this.timingRef.current : this.costsRef.current
    let disabledStateName = metricType === 'timing' ? 'timingFormationAddDisabled' : 'costsFormationAddDisabled'
    if (ref.value && !this.state.metrics[metricType].formations[ref.value.toUpperCase()]) {
      disable = false
    }

    if (this.state[disabledStateName] !== disable) {
      // @ts-ignore
      this.setState({ [disabledStateName]: !this.state[disabledStateName] })
    }
  }

  addFormation(metricType: string) {
    var metrics: OKDrillMetrics = Object.assign({}, this.state.metrics)
    if (metricType === 'timing') {
      metrics.timing.formations[this.timingRef.current.value.toUpperCase()] = { vertDuration: undefined, horzDuration: undefined }
      this.timingRef.current.value = ""
      this.setState({ timingFormationAddDisabled: true, metrics: metrics })
    } else {
      metrics.costs.formations[this.costsRef.current.value.toUpperCase()] = { vertTvdDiff: undefined, horzLatLengthDiff: undefined, vertCostPerFt: undefined, horzCostPerFt: undefined }
      this.costsRef.current.value = ""
      this.setState({ costsFormationAddDisabled: true, metrics: metrics })
    }
  }

  deleteFormation(metricType: string, formation: string) {
    var metrics: OKDrillMetrics = Object.assign({}, this.state.metrics)
    let { [formation]: deletedFormation, ...remainingFormations } = metrics[metricType].formations
    metrics[metricType].formations = remainingFormations
    this.setState({ metrics: metrics })
  }

  handleFormationValueChange(e, metricType: string, property: string) {
    var metrics: OKDrillMetrics = Object.assign({}, this.state.metrics)
    metrics[metricType].formations[e.target.name][property] = e.target.value
    this.setState({ metrics: metrics })
  }

  render() {
    return (
      <form ref={this.formRef} autoComplete="off" noValidate onSubmit={this.handleSubmit} style={{ height: "calc(100% - 83px)", maxHeight: "calc(100% - 83px)"}}>
        <div className="fb-row-nowrap" style={{height: "100%", maxHeight: "100%"}}>
        
          {/* TIMING  */}
          <div className="fi-def" style={{maxWidth: "500px", marginRight:32}}>
            <div className="card" style={{marginBottom:16}}>
              <div className="card-header"><b>Timing</b></div>
              <div className="card-body">

                {/* <div className="form-group row">
                  <label htmlFor="drillDepthThreshold" className="col col-form-label">Drill Depth Threshold</label>
                  <div className="input-group col-8">
                    <input type="text" className="form-control" id="drillDepthThreshold" pattern={this.regexNum} value={this.state.metrics.timing.drillDepthThreshold} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">ft.</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div> */}

                <div className="form-group row">
                  <label htmlFor="moveTime" className="col col-form-label">Move Time</label>
                  <div className="input-group col-8">
                    <input type="text" className="form-control" id="moveTime" pattern={this.regexNum} value={this.state.metrics.timing.moveTime} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="card" style={{maxHeight: "calc(100vh - 340px", minHeight: 300}}>
                  <div className="card-header" >
                    <div className="form-group row" style={{marginBottom:0}}>
                      <label htmlFor="timingFormationInput" className="col col-form-label"><b>Formations</b></label>
                      <div className="input-group col-8">
                        <input ref="timingFormationInput" type="text" className="form-control" id="timingFormationInput" onChange={() => this.handleFormationChange('timing')}/>
                        <div className="input-group-append"><button className="btn btn-secondary" type="button" disabled={this.state.timingFormationAddDisabled} onClick={() => this.addFormation('timing')}>Add</button></div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body" style={{overflowY: "auto", paddingTop: 0}}>
                    {
                      Object.keys(this.state.metrics.timing.formations).map(f => ({ formation: f, data: this.state.metrics.timing.formations[f] })).sort((a, b) => {
                        let formationA = a.formation.toUpperCase()
                        let formationB = b.formation.toUpperCase()
                        return formationA < formationB ? -1 : formationA > formationB ? 1 : 0
                      }).map(obj => 
                        <div className="card" style={{marginTop: 15}} key={`timing-${obj.formation}`}>
                          <div className="card-header formation">{obj.formation}
                            <a className="formation-remove" onClick={() => this.deleteFormation('timing', obj.formation)}><FontAwesomeIcon icon={faTrashAlt} color="red"/></a>
                          </div>
                          <div className="card-body">

                            <div className="form-group row">
                              <label htmlFor={`timingFormationVert-${obj.formation}`} className="col col-form-label">Vert Duration</label>
                              <div className="input-group col-8">
                                <input type="text" className="form-control" id={`timingFormationVert-${obj.formation}`} name={obj.formation} pattern={this.regexNum} required
                                  value={obj.data.vertDuration}
                                  onChange={e => this.handleFormationValueChange(e, 'timing', 'vertDuration')}
                                />
                                <div className="input-group-append"><span className="input-group-text">days</span></div>
                                <div className="invalid-feedback">Please enter a number.</div>
                              </div>
                            </div>

                            <div className="form-group row" style={{marginBottom: "0"}}>
                              <label htmlFor={`timingFormationHorz-${obj.formation}`} className="col col-form-label">Horz Duration</label>
                              <div className="input-group col-8">
                                <input type="text" className="form-control" id={`timingFormationHorz-${obj.formation}`} name={obj.formation} pattern={this.regexNum} required
                                  value={obj.data.horzDuration}
                                  onChange={e => this.handleFormationValueChange(e, 'timing', 'horzDuration')}
                                />
                                <div className="input-group-append"><span className="input-group-text">days</span></div>
                                <div className="invalid-feedback">Please enter a number.</div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>

              </div>
            </div>
            <button type="submit" className="btn btn-lg btn-gpor-primary"><b>Save Changes</b></button>
          </div>

          {/* COSTS  */}
          <div className="fi-def" style={{maxHeight: "100%", maxWidth: "500px"}}>
            <div className="card">
              <div className="card-header"><b>Costs</b></div>
              <div className="card-body" style={{maxHeight: "calc(100vh - 178.33px)"}}>

                <div className="form-group row">
                  <label htmlFor="moveCost" className="col col-form-label">Move Cost</label>
                  <div className="input-group col-8">
                    <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                    <input type="text" className="form-control" id="moveCost" pattern={this.regexNum} value={this.state.metrics.costs.moveCost} onChange={this.handleCostChange} required/>
                    <div className="input-group-append"><span className="input-group-text">per ft.</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="card" style={{maxHeight: "calc(100vh - 299px", minHeight: 300}}>
                  <div className="card-header" >
                    <div className="form-group row" style={{marginBottom:0}}>
                      <label htmlFor="costsFormationInput" className="col col-form-label"><b>Formations</b></label>
                      <div className="input-group col-8">
                        <input ref="costsFormationInput" type="text" className="form-control" id="costsFormationInput" onChange={() => this.handleFormationChange('costs')}/>
                        <div className="input-group-append"><button className="btn btn-secondary" type="button" disabled={this.state.costsFormationAddDisabled} onClick={() => this.addFormation('costs')}>Add</button></div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body" style={{overflowY: "auto", paddingTop: 0}}>
                    {
                      Object.keys(this.state.metrics.costs.formations).map(f => ({ formation: f, data: this.state.metrics.costs.formations[f] })).sort((a, b) => {
                        let formationA = a.formation.toUpperCase()
                        let formationB = b.formation.toUpperCase()
                        return formationA < formationB ? -1 : formationA > formationB ? 1 : 0
                      }).map(obj => 
                        <div className="card" style={{marginTop: 15}} key={`costs-${obj.formation}`}>
                          <div className="card-header formation">{obj.formation}
                            <a className="formation-remove" onClick={() => this.deleteFormation('costs', obj.formation)}><FontAwesomeIcon icon={faTrashAlt} color="red"/></a>
                          </div>
                          <div className="card-body">
                            
                            <div className="form-group row">
                              <label htmlFor={`costsFormationVertDiff-${obj.formation}`} className="col col-form-label">Vert TVD Difference</label>
                              <div className="input-group col-8">
                                <input type="text" className="form-control" id={`costsFormationVertDiff-${obj.formation}`} name={obj.formation} pattern={this.regexNumNeg} required
                                  value={obj.data.vertTvdDiff}
                                  onChange={e => this.handleFormationValueChange(e, 'costs', 'vertTvdDiff')}
                                />
                                <div className="input-group-append"><span className="input-group-text">ft.</span></div>
                                <div className="invalid-feedback">Please enter a number.</div>
                              </div>
                            </div>
                            
                            <div className="form-group row">
                              <label htmlFor={`costsFormationHorzDiff-${obj.formation}`} className="col col-form-label">Horz LL Difference</label>
                              <div className="input-group col-8">
                                <input type="text" className="form-control" id={`costsFormationHorzDiff-${obj.formation}`} name={obj.formation} pattern={this.regexNumNeg} required
                                  value={obj.data.horzLatLengthDiff}
                                  onChange={e => this.handleFormationValueChange(e, 'costs', 'horzLatLengthDiff')}
                                />
                                <div className="input-group-append"><span className="input-group-text">ft.</span></div>
                                <div className="invalid-feedback">Please enter a number.</div>
                              </div>
                            </div>

                            <div className="form-group row">
                              <label htmlFor={`costsFormationVertCost-${obj.formation}`} className="col col-form-label">Vert Cost per ft.</label>
                              <div className="input-group col-8">
                                <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                                <input type="text" className="form-control" id={`costsFormationVertCost-${obj.formation}`} name={obj.formation} pattern={this.regexNum} required
                                  value={obj.data.vertCostPerFt}
                                  onChange={e => this.handleFormationValueChange(e, 'costs', 'vertCostPerFt')}
                                />
                                <div className="input-group-append"><span className="input-group-text">per ft.</span></div>
                                <div className="invalid-feedback">Please enter a number.</div>
                              </div>
                            </div>

                            <div className="form-group row">
                              <label htmlFor={`costsFormationHorzCost-${obj.formation}`} className="col col-form-label">Horz Cost per ft.</label>
                              <div className="input-group col-8">
                                <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                                <input type="text" className="form-control" id={`costsFormationHorzCost-${obj.formation}`} name={obj.formation} pattern={this.regexNum} required
                                  value={obj.data.horzCostPerFt}
                                  onChange={e => this.handleFormationValueChange(e, 'costs', 'horzCostPerFt')}
                                />
                                <div className="input-group-append"><span className="input-group-text">per ft.</span></div>
                                <div className="invalid-feedback">Please enter a number.</div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )
                    }
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

export default DrillingMetricsViewOK