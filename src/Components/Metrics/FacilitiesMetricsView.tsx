import React, { Component } from 'react'
import './FacilitiesMetricsView.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { FacilitiesMetrics } from '../../types';

interface Props {
  metrics: FacilitiesMetrics
  saveChanges: Function
}
interface State {
  metrics: FacilitiesMetrics
  phaseWindowAddDisabled: boolean
}

class FacilitiesMetricsView extends Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      metrics: JSON.parse(JSON.stringify(this.props.metrics)),
      phaseWindowAddDisabled: true
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTimingChange = this.handleTimingChange.bind(this)
    this.handlePhaseWindowChange = this.handlePhaseWindowChange.bind(this)
    this.addPhaseWindow = this.addPhaseWindow.bind(this)
  }
  formRef = React.createRef<HTMLFormElement>()
  pwRef = React.createRef<HTMLInputElement>()
  regexNum = "^\\d{0,8}(\\.\\d{0,2})?$"

  handleSubmit(event) {
    event.preventDefault()
    event.stopPropagation()

    if (this.formRef.current.checkValidity() === false) {
      this.formRef.current.classList.add('was-validated')
    } else {
      var metrics: FacilitiesMetrics = Object.assign({}, this.state.metrics)
      metrics.timing.defDrillOutToFacilities = +metrics.timing.defDrillOutToFacilities
      metrics.timing.durationUnder4Wells = +metrics.timing.durationUnder4Wells
      metrics.timing.defDuration = +metrics.timing.defDuration
      metrics.timing.moveTime = +metrics.timing.moveTime

      for (let pw of this.getPhaseWindows()) {
        for (let i = 1; i <=6; i++) {
          metrics.costs[i][pw] = +metrics.costs[i][pw]
        }
      }      
      this.props.saveChanges(metrics).then(() => {
        this.formRef.current.classList.remove('was-validated')
      })
    }
  }

  handleTimingChange(event) {
    var metrics: FacilitiesMetrics = Object.assign({}, this.state.metrics)
    metrics.timing[event.target.id] = event.target.value
    this.setState({ metrics: metrics })
  }

  handleCostChange(event, wellCount: number) {
    var metrics: FacilitiesMetrics = Object.assign({}, this.state.metrics)
    metrics.costs[wellCount][event.target.name] = event.target.value
    this.setState({ metrics: metrics })
  }

  getPhaseWindows() {
    var pws = []
    for (let i = 1; i <= 6; i++) {
      for (let pw of Object.keys(this.state.metrics.costs[i])) {
        if (!pws.includes(pw))
          pws.push(pw)
      }
    }
    return pws
  }

  handlePhaseWindowChange() {
    var disable = true
    if (this.pwRef.current.value && !this.state.metrics.costs[1].hasOwnProperty(this.pwRef.current.value.toUpperCase())) {
      disable = false
    }

    if (this.state.phaseWindowAddDisabled !== disable) {
      this.setState({ phaseWindowAddDisabled: !this.state.phaseWindowAddDisabled })
    }
  }

  addPhaseWindow() {
    var metrics: FacilitiesMetrics = Object.assign({}, this.state.metrics)
    var newPhaseWindow = this.pwRef.current.value.toUpperCase()
    for (let i = 1; i <=6; i++) {
      metrics.costs[i][newPhaseWindow] = ""
    }
    this.pwRef.current.value = ""
    this.setState({ phaseWindowAddDisabled: true, metrics: metrics })
  }

  removePhaseWindow(phaseWindow: string) {
    var metrics: FacilitiesMetrics = Object.assign({}, this.state.metrics)
    for (let i = 1; i <=6; i++) {
      delete metrics.costs[i][phaseWindow]
    }
    this.setState({ metrics: metrics })
  }

  render() {
    var headersPrinted = false
    return (
      <form ref={this.formRef} autoComplete="off" noValidate onSubmit={this.handleSubmit} style={{ height: "calc(100% - 83px)", maxHeight: "calc(100% - 83px)"}}>
        <div className="fb-row-nowrap" style={{height: "100%", maxHeight: "100%", width:"100%"}}>
        
          {/* TIMING  */}
          <div className="fi-def" style={{maxWidth: "450px", marginRight:16}}>
            <div className="card" style={{marginBottom: "16px"}}>
              <div className="card-header"><b>Timing</b></div>
              <div className="card-body">

                <div className="form-group row">
                  <label htmlFor="defDrillOutToFacilities" className="col-sm-8 col-form-label">Default Drill Out to Facilities</label>
                  <div className="input-group col-sm-4">
                    <input type="text" autoComplete="new-password" className="form-control" id="defDrillOutToFacilities" pattern={this.regexNum} value={this.state.metrics.timing.defDrillOutToFacilities} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="durationUnder4Wells" className="col-sm-8 col-form-label">Default Drill Out to Production (1-3 Wells)</label>
                  <div className="input-group col-sm-4">
                    <input type="text" autoComplete="new-password" className="form-control" id="durationUnder4Wells" pattern={this.regexNum} value={this.state.metrics.timing.durationUnder4Wells} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="defDuration" className="col-sm-8 col-form-label">Default Drill Out to Production (4+ Wells)</label>
                  <div className="input-group col-sm-4">
                    <input type="text" autoComplete="new-password" className="form-control" id="defDuration" pattern={this.regexNum} value={this.state.metrics.timing.defDuration} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row" style={{marginBottom:0}}>
                  <label htmlFor="moveTime" className="col-sm-8 col-form-label">Move Time</label>
                  <div className="input-group col-sm-4">
                    <input type="text" autoComplete="new-password" className="form-control" id="moveTime" pattern={this.regexNum} value={this.state.metrics.timing.moveTime} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

              </div>
            </div>
            <button type="submit" className="btn btn-lg btn-gpor-primary"><b>Save Changes</b></button>
          </div>

          {/* COSTS  */}
          <div className="fi-def" style={{ maxWidth: "900px"}}>
            <div className="card">
              <div className="card-header">
                <div className="form-group row" style={{marginBottom:0}}>
                  <label htmlFor="phaseWindowInput" className="col col-form-label"><b>Costs</b></label>
                  <div className="input-group col" style={{maxWidth:400}}>
                    <input ref={this.pwRef} type="text" autoComplete="new-password" className="form-control" id="phaseWindowInput" onChange={this.handlePhaseWindowChange}/>
                    <div className="input-group-append"><button className="btn btn-secondary" type="button" disabled={this.state.phaseWindowAddDisabled} onClick={this.addPhaseWindow}>Add Phase Window</button></div>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{maxHeight: "calc(100vh - 178.33px)", paddingTop: 6}}>

                { this.getPhaseWindows().map(pw => {
                  var pwHtml = (
                    <div key={pw} className="row" style={{marginBottom:0}}>
                      { !headersPrinted
                        ? <div className="col-md-3 col-form-label" style={{padding:0}}>
                            <label className="col col-form-label" style={{height:25}}></label>
                            <label className="col col-form-label">{pw}</label>
                          </div>
                        : <label className="col-md-3 col-form-label">{pw}</label>
                      }
                      {[1,2,3,4,5,6].map(num => 
                        <div key={num} className="col" style={{padding:0}}>
                          { !headersPrinted ? <label htmlFor={`well${num}`} className="col col-form-label" style={{paddingRight:0}}>{num} Well</label> : "" }
                          <input type="text" autoComplete="new-password" className="form-control" id={`well${num}`} name={pw} pattern={this.regexNum}
                            value={this.state.metrics.costs[num][pw]}
                            onChange={e => this.handleCostChange(e, num)} required
                          />
                        </div>
                      )}
                      <div style={{padding:0, width:30, marginTop:5, marginLeft:8}}>
                        { !headersPrinted ? <label className="col col-form-label" style={{height:25}}></label>  : "" }
                        <a className="phaseWindow-remove" onClick={() => this.removePhaseWindow(pw)}><FontAwesomeIcon icon={faTrashAlt} color="green"/></a>
                      </div>
                    </div>
                  )

                  headersPrinted = true
                  return pwHtml
                })}
              </div>
            </div>
          </div>

        </div>
      </form>
    )
  }
}

export default FacilitiesMetricsView