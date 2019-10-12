import React, { Component } from 'react'
import { FracMetrics } from '../../types';

interface Props {
  metrics: FracMetrics
  saveChanges: Function
}
interface State {
  metrics: FracMetrics
}

class FracMetricsView extends Component<Props, State> {
  constructor(props) {
    super(props)

    var metrics = JSON.parse(JSON.stringify(this.props.metrics))
    if (metrics.costs.waterCostPerBBL.freshWaterPct) {
      metrics.costs.waterCostPerBBL.freshWaterPct = (metrics.costs.waterCostPerBBL.freshWaterPct * 100).toFixed()
    }
    if (metrics.costs.waterCostPerBBL.recycledWaterPct) {
      metrics.costs.waterCostPerBBL.recycledWaterPct = (metrics.costs.waterCostPerBBL.recycledWaterPct * 100).toFixed()
    }
    if (metrics.costs.waterCostPerBBL.totalDisposalPct) {
      metrics.costs.waterCostPerBBL.totalDisposalPct = (metrics.costs.waterCostPerBBL.totalDisposalPct * 100).toFixed()
    }
    this.state = {
      metrics: metrics
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCostChange = this.handleCostChange.bind(this)
    this.handleTimingChange = this.handleTimingChange.bind(this)
  }
  formRef = React.createRef<HTMLFormElement>()
  regexNum = "^\\d{0,8}(\\.\\d{0,2})?$"
  regexPct = "^\\d{0,2}(\\.\\d{0,2})?$|^100$"

  handleSubmit(event) {
    event.preventDefault()
    event.stopPropagation()

    if (this.formRef.current.checkValidity() === false) {
      this.formRef.current.classList.add('was-validated')
    } else {
      var metrics: FracMetrics = JSON.parse(JSON.stringify(this.state.metrics))
      metrics.timing.minDrillToFrac = +metrics.timing.minDrillToFrac
      metrics.timing.defDrillToFrac = +metrics.timing.defDrillToFrac
      metrics.timing.stageLength = +metrics.timing.stageLength
      metrics.timing.winterStagesPerDayDelay = +metrics.timing.winterStagesPerDayDelay

      metrics.costs.costPerDay = +metrics.costs.costPerDay
      metrics.costs.fixedCosts.locationPrep = +metrics.costs.fixedCosts.locationPrep
      metrics.costs.fixedCosts.toePrep = +metrics.costs.fixedCosts.toePrep
      metrics.costs.fixedCosts.fracFixedCosts = +metrics.costs.fixedCosts.fracFixedCosts

      metrics.costs.costsPerStage.wireline = +metrics.costs.costsPerStage.wireline
      metrics.costs.costsPerStage.plugs = +metrics.costs.costsPerStage.plugs
      metrics.costs.costsPerStage.isolationTool = +metrics.costs.costsPerStage.isolationTool

      metrics.costs.waterCostPerBBL.freshWaterPct = +metrics.costs.waterCostPerBBL.freshWaterPct / 100
      metrics.costs.waterCostPerBBL.freshWaterCostPerBBL = +metrics.costs.waterCostPerBBL.freshWaterCostPerBBL
      metrics.costs.waterCostPerBBL.recycledWaterPct = +metrics.costs.waterCostPerBBL.recycledWaterPct / 100
      metrics.costs.waterCostPerBBL.recycledWaterCostPerBBL = +metrics.costs.waterCostPerBBL.recycledWaterCostPerBBL
      metrics.costs.waterCostPerBBL.totalDisposalPct = +metrics.costs.waterCostPerBBL.totalDisposalPct / 100
      metrics.costs.waterCostPerBBL.saltWaterDisposalCostPerBBL = +metrics.costs.waterCostPerBBL.saltWaterDisposalCostPerBBL
      
      metrics.matrix.underDrillDepthThreshold.spacingUnder800.baseStagesPerDay = +metrics.matrix.underDrillDepthThreshold.spacingUnder800.baseStagesPerDay
      metrics.matrix.underDrillDepthThreshold.spacingUnder800.bblsWaterPerStage = +metrics.matrix.underDrillDepthThreshold.spacingUnder800.bblsWaterPerStage
      metrics.matrix.underDrillDepthThreshold.spacingUnder800.crewCostPerStage = +metrics.matrix.underDrillDepthThreshold.spacingUnder800.crewCostPerStage
      
      metrics.matrix.underDrillDepthThreshold.spacingFrom800To1200.baseStagesPerDay = +metrics.matrix.underDrillDepthThreshold.spacingFrom800To1200.baseStagesPerDay
      metrics.matrix.underDrillDepthThreshold.spacingFrom800To1200.bblsWaterPerStage = +metrics.matrix.underDrillDepthThreshold.spacingFrom800To1200.bblsWaterPerStage
      metrics.matrix.underDrillDepthThreshold.spacingFrom800To1200.crewCostPerStage = +metrics.matrix.underDrillDepthThreshold.spacingFrom800To1200.crewCostPerStage
      
      metrics.matrix.underDrillDepthThreshold.spacingFrom1200To1500.baseStagesPerDay = +metrics.matrix.underDrillDepthThreshold.spacingFrom1200To1500.baseStagesPerDay
      metrics.matrix.underDrillDepthThreshold.spacingFrom1200To1500.bblsWaterPerStage = +metrics.matrix.underDrillDepthThreshold.spacingFrom1200To1500.bblsWaterPerStage
      metrics.matrix.underDrillDepthThreshold.spacingFrom1200To1500.crewCostPerStage = +metrics.matrix.underDrillDepthThreshold.spacingFrom1200To1500.crewCostPerStage
      
      metrics.matrix.underDrillDepthThreshold.spacingOver1500.baseStagesPerDay = +metrics.matrix.underDrillDepthThreshold.spacingOver1500.baseStagesPerDay
      metrics.matrix.underDrillDepthThreshold.spacingOver1500.bblsWaterPerStage = +metrics.matrix.underDrillDepthThreshold.spacingOver1500.bblsWaterPerStage
      metrics.matrix.underDrillDepthThreshold.spacingOver1500.crewCostPerStage = +metrics.matrix.underDrillDepthThreshold.spacingOver1500.crewCostPerStage
      
      metrics.matrix.overDrillDepthThreshold.spacingUnder800.baseStagesPerDay = +metrics.matrix.overDrillDepthThreshold.spacingUnder800.baseStagesPerDay
      metrics.matrix.overDrillDepthThreshold.spacingUnder800.bblsWaterPerStage = +metrics.matrix.overDrillDepthThreshold.spacingUnder800.bblsWaterPerStage
      metrics.matrix.overDrillDepthThreshold.spacingUnder800.crewCostPerStage = +metrics.matrix.overDrillDepthThreshold.spacingUnder800.crewCostPerStage
      
      metrics.matrix.overDrillDepthThreshold.spacingFrom800To1200.baseStagesPerDay = +metrics.matrix.overDrillDepthThreshold.spacingFrom800To1200.baseStagesPerDay
      metrics.matrix.overDrillDepthThreshold.spacingFrom800To1200.bblsWaterPerStage = +metrics.matrix.overDrillDepthThreshold.spacingFrom800To1200.bblsWaterPerStage
      metrics.matrix.overDrillDepthThreshold.spacingFrom800To1200.crewCostPerStage = +metrics.matrix.overDrillDepthThreshold.spacingFrom800To1200.crewCostPerStage
      
      metrics.matrix.overDrillDepthThreshold.spacingFrom1200To1500.baseStagesPerDay = +metrics.matrix.overDrillDepthThreshold.spacingFrom1200To1500.baseStagesPerDay
      metrics.matrix.overDrillDepthThreshold.spacingFrom1200To1500.bblsWaterPerStage = +metrics.matrix.overDrillDepthThreshold.spacingFrom1200To1500.bblsWaterPerStage
      metrics.matrix.overDrillDepthThreshold.spacingFrom1200To1500.crewCostPerStage = +metrics.matrix.overDrillDepthThreshold.spacingFrom1200To1500.crewCostPerStage
      
      metrics.matrix.overDrillDepthThreshold.spacingOver1500.baseStagesPerDay = +metrics.matrix.overDrillDepthThreshold.spacingOver1500.baseStagesPerDay
      metrics.matrix.overDrillDepthThreshold.spacingOver1500.bblsWaterPerStage = +metrics.matrix.overDrillDepthThreshold.spacingOver1500.bblsWaterPerStage
      metrics.matrix.overDrillDepthThreshold.spacingOver1500.crewCostPerStage = +metrics.matrix.overDrillDepthThreshold.spacingOver1500.crewCostPerStage

      this.props.saveChanges(metrics).then(() => {
        this.formRef.current.classList.remove('was-validated')
      })
    }
  }

  handleTimingChange(event) {
    var metrics: FracMetrics = Object.assign({}, this.state.metrics)
    metrics.timing[event.target.id] = event.target.value
    this.setState({ metrics: metrics })
  }

  handleCostChange(event, costCategory?: string) {
    var metrics: FracMetrics = Object.assign({}, this.state.metrics)
    if (costCategory) {
      metrics.costs[costCategory][event.target.id] = event.target.value
    } else {
      metrics.costs[event.target.id] = event.target.value
    }
    this.setState({ metrics: metrics })
  }

  handleMatrixChange(event, thresholdCat, spacingCat) {
    var metrics: FracMetrics = Object.assign({}, this.state.metrics)
    metrics.matrix[thresholdCat][spacingCat][event.target.id] = event.target.value
    this.setState({ metrics: metrics })
  }

  render() {
    return (
      <form ref={this.formRef} autoComplete="off" noValidate onSubmit={this.handleSubmit} style={{ height: "calc(100% - 83px)", maxHeight: "calc(100% - 83px)"}}>
        <div className="fb-row-nowrap" style={{height: "100%", maxHeight: "100%"}}>
        
          {/* TIMING  */}
          <div className="fi-def" style={{maxWidth: "750px", marginRight:16}}>
            <div className="card" style={{marginBottom: "16px"}}>
              <div className="card-header"><b>Timing</b></div>
              <div className="card-body">

                <div className="form-group row">
                  <label htmlFor="minDaysFromDrillEndToFracStart" className="col-sm-4 col-form-label">Min Drill to Frac</label>
                  <div className="input-group col-sm-8">
                    <input type="text" className="form-control" id="minDaysFromDrillEndToFracStart" pattern={this.regexNum} value={this.state.metrics.timing.minDrillToFrac} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="defDrillToFrac" className="col-sm-4 col-form-label">Default Drill to Frac</label>
                  <div className="input-group col-sm-8">
                    <input type="text" className="form-control" id="defDrillToFrac" pattern={this.regexNum} value={this.state.metrics.timing.defDrillToFrac} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">days</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="stageLength" className="col-sm-4 col-form-label">Stage Length</label>
                  <div className="input-group col-sm-8">
                    <input type="text" className="form-control" id="stageLength" pattern={this.regexNum} value={this.state.metrics.timing.stageLength} onChange={this.handleTimingChange} required/>
                    <div className="input-group-append"><span className="input-group-text">ft.</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                <div className="form-group row">
                  <label htmlFor="winterStagesPerDayDelay" className="col-sm-4 col-form-label">Winter Stages Delay</label>
                  <div className="input-group col-sm-8">
                    <input type="text" className="form-control" id="winterStagesPerDayDelay" pattern={this.regexNum} value={this.state.metrics.timing.winterStagesPerDayDelay} onChange={this.handleTimingChange} required/>
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

            {/* EFFICIENCY MATRIX */}
            <div className="card" style={{marginBottom:16}}>
              <div className="card-header"><b>Efficiency Matrix</b></div>
              <div className="card-body" style={{height: "100%", maxHeight: "calc(100vh - 188.33px)", overflowY: "auto" }}>

                {/* UNDER DRILL DEPTH THRESHOLD*/}
                <div className="card" style={{marginBottom: 12}}>
                  <div className="card-header"><b>Under Drill Depth Threshold</b></div>
                  <div className="card-body" style={{paddingBottom: 0, paddingTop: 0}}>
                    <div className="form-group row" style={{marginBottom:0}}>
                      <label className="col-sm-3 col-form-label" style={{minWidth:165}}></label>
                      <label className="col-md-2 col-form-label" style={{paddingRight:0}}>Stages/Day</label>
                      <label className="col-md-2 col-form-label" style={{minWidth: 110, maxWidth: 110, width:110}}>Frac Design</label>
                      <label className="col-md-2 col-form-label" style={{paddingRight:0}}>BBLs Water/Stage</label>
                      <label className="col-md-2 col-form-label" style={{paddingRight:0}}>Crew Cost/Stage</label>
                    </div>

                    {/* AVG SPACING: < 800 */}
                    <div className="form-group row" style={{marginBottom:0}}>
                      <label className="col-sm-3 col-form-label" style={{minWidth:165}}>Avg Spacing: &lt; 800'</label>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="baseStagesPerDay" pattern={this.regexNum}
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingUnder800.baseStagesPerDay}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingUnder800")} required
                        />
                      </div>
                      <div style={{padding:0, width:110}}>
                        <select id="fracDesign" className="form-control"
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingUnder800.fracDesign}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingUnder800")}>
                          <option>225k Design</option>
                          <option>275k Design</option>
                          <option>375k Design</option>
                          <option>500k Design</option>
                        </select>
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="bblsWaterPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingUnder800.bblsWaterPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingUnder800")} required
                        />
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="crewCostPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingUnder800.crewCostPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingUnder800")} required
                        />
                      </div>
                    </div>

                    {/* AVG SPACING: 800-1200 */}
                    <div className="form-group row" style={{marginBottom:0}}>
                      <label className="col-sm-3 col-form-label" style={{minWidth:165}}>Avg Spacing: 800'-1200'</label>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="baseStagesPerDay" pattern={this.regexNum}
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingFrom800To1200.baseStagesPerDay}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingFrom800To1200")} required
                        />
                      </div>
                      <div style={{padding:0, width:110}}>
                        <select id="fracDesign" className="form-control"
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingFrom800To1200.fracDesign}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingFrom800To1200")}>
                          <option>225k Design</option>
                          <option>275k Design</option>
                          <option>375k Design</option>
                          <option>500k Design</option>
                        </select>
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="bblsWaterPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingFrom800To1200.bblsWaterPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingFrom800To1200")} required
                        />
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="crewCostPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingFrom800To1200.crewCostPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingFrom800To1200")} required
                        />
                      </div>
                    </div>

                    {/* AVG SPACING: 1200-1500 */}
                    <div className="form-group row" style={{marginBottom:0}}>
                      <label className="col-md-3 col-form-label" style={{minWidth:165}}>Avg Spacing: 1200'-1500'</label>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="baseStagesPerDay" pattern={this.regexNum}
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingFrom1200To1500.baseStagesPerDay}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingFrom1200To1500")} required
                        />
                      </div>
                      <div style={{padding:0, width:110}}>
                        <select id="fracDesign" className="form-control"
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingFrom1200To1500.fracDesign}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingFrom1200To1500")}>
                          <option>225k Design</option>
                          <option>275k Design</option>
                          <option>375k Design</option>
                          <option>500k Design</option>
                        </select>
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="bblsWaterPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingFrom1200To1500.bblsWaterPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingFrom1200To1500")} required
                        />
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="crewCostPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingFrom1200To1500.crewCostPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingFrom1200To1500")} required
                        />
                      </div>
                    </div>

                    {/* AVG SPACING: >1500 */}
                    <div className="form-group row" style={{marginBottom:15}}>
                      <label className="col-sm-3 col-form-label" style={{minWidth:165}}>Avg Spacing: >1500'</label>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="baseStagesPerDay" pattern={this.regexNum}
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingOver1500.baseStagesPerDay}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingOver1500")} required
                        />
                      </div>
                      <div style={{padding:0, width:110}}>
                        <select id="fracDesign" className="form-control"
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingOver1500.fracDesign}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingOver1500")}>
                          <option>225k Design</option>
                          <option>275k Design</option>
                          <option>375k Design</option>
                          <option>500k Design</option>
                        </select>
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="bblsWaterPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingOver1500.bblsWaterPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingOver1500")} required
                        />
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="crewCostPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.underDrillDepthThreshold.spacingOver1500.crewCostPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "underDrillDepthThreshold", "spacingOver1500")} required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* OVER DRILL DEPTH THRESHOLD*/}
                <div className="card">
                  <div className="card-header"><b>Over Drill Depth Threshold</b></div>
                  <div className="card-body" style={{paddingBottom: 0, paddingTop: 0}}>
                    <div className="form-group row" style={{marginBottom:0}}>
                      <label className="col-sm-3 col-form-label" style={{minWidth:165}}></label>
                      <label className="col-md-2 col-form-label" style={{paddingRight:0}}>Stages/Day</label>
                      <label className="col-md-2 col-form-label" style={{minWidth: 110, maxWidth: 110, width:110}}>Frac Design</label>
                      <label className="col-md-2 col-form-label" style={{paddingRight:0}}>BBLs Water/Stage</label>
                      <label className="col-md-2 col-form-label" style={{paddingRight:0}}>Crew Cost/Stage</label>
                    </div>

                    {/* AVG SPACING: < 800 */}
                    <div className="form-group row" style={{marginBottom:0}}>
                      <label className="col-sm-3 col-form-label" style={{minWidth:165}}>Avg Spacing: &lt; 800'</label>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="baseStagesPerDay" pattern={this.regexNum}
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingUnder800.baseStagesPerDay}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingUnder800")} required
                        />
                      </div>
                      <div style={{padding:0, width:110}}>
                        <select id="fracDesign" className="form-control"
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingUnder800.fracDesign}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingUnder800")}>
                          <option>225k Design</option>
                          <option>275k Design</option>
                          <option>375k Design</option>
                          <option>500k Design</option>
                        </select>
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="bblsWaterPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingUnder800.bblsWaterPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingUnder800")} required
                        />
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="crewCostPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingUnder800.crewCostPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingUnder800")} required
                        />
                      </div>
                    </div>

                    {/* AVG SPACING: 800-1200 */}
                    <div className="form-group row" style={{marginBottom:0}}>
                      <label className="col-sm-3 col-form-label" style={{minWidth:165}}>Avg Spacing: 800'-1200'</label>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="baseStagesPerDay" pattern={this.regexNum}
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingFrom800To1200.baseStagesPerDay}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingFrom800To1200")} required
                        />
                      </div>
                      <div style={{padding:0, width:110}}>
                        <select id="fracDesign" className="form-control"
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingFrom800To1200.fracDesign}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingFrom800To1200")}>
                          <option>225k Design</option>
                          <option>275k Design</option>
                          <option>375k Design</option>
                          <option>500k Design</option>
                        </select>
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="bblsWaterPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingFrom800To1200.bblsWaterPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingFrom800To1200")} required
                        />
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="crewCostPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingFrom800To1200.crewCostPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingFrom800To1200")} required
                        />
                      </div>
                    </div>

                    {/* AVG SPACING: 1200-1500 */}
                    <div className="form-group row" style={{marginBottom:0}}>
                      <label className="col-md-3 col-form-label" style={{minWidth:165}}>Avg Spacing: 1200'-1500'</label>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="baseStagesPerDay" pattern={this.regexNum}
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingFrom1200To1500.baseStagesPerDay}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingFrom1200To1500")} required
                        />
                      </div>
                      <div style={{padding:0, width:110}}>
                        <select id="fracDesign" className="form-control"
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingFrom1200To1500.fracDesign}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingFrom1200To1500")}>
                          <option>225k Design</option>
                          <option>275k Design</option>
                          <option>375k Design</option>
                          <option>500k Design</option>
                        </select>
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="bblsWaterPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingFrom1200To1500.bblsWaterPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingFrom1200To1500")} required
                        />
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="crewCostPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingFrom1200To1500.crewCostPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingFrom1200To1500")} required
                        />
                      </div>
                    </div>

                    {/* AVG SPACING: >1500 */}
                    <div className="form-group row" style={{marginBottom:15}}>
                      <label className="col-sm-3 col-form-label" style={{minWidth:165}}>Avg Spacing: >1500'</label>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="baseStagesPerDay" pattern={this.regexNum}
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingOver1500.baseStagesPerDay}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingOver1500")} required
                        />
                      </div>
                      <div style={{padding:0, width:110}}>
                        <select id="fracDesign" className="form-control"
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingOver1500.fracDesign}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingOver1500")}>
                          <option>225k Design</option>
                          <option>275k Design</option>
                          <option>375k Design</option>
                          <option>500k Design</option>
                        </select>
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="bblsWaterPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingOver1500.bblsWaterPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingOver1500")} required
                        />
                      </div>
                      <div className="col-md-2" style={{padding:0}}>
                        <input type="text" className="form-control" id="crewCostPerStage" pattern={this.regexNum}
                          value={this.state.metrics.matrix.overDrillDepthThreshold.spacingOver1500.crewCostPerStage}
                          onChange={(e) => this.handleMatrixChange(e, "overDrillDepthThreshold", "spacingOver1500")} required
                        />
                      </div>
                    </div>
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
              <div className="card-body" style={{height: "100%", maxHeight: "calc(100vh - 188.33px)", overflowY: "auto" }}>

                <div className="form-group row">
                  <label htmlFor="costPerDay" className="col-sm-4 col-form-label">Cost per Day</label>
                  <div className="input-group col-sm-8">
                    <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                    <input type="text" className="form-control" id="costPerDay" pattern={this.regexNum} value={this.state.metrics.costs.costPerDay} onChange={e => this.handleCostChange(e)} required/>
                    <div className="input-group-append"><span className="input-group-text">per day</span></div>
                    <div className="invalid-feedback">Please enter a number.</div>
                  </div>
                </div>

                {/* FIXED COSTS*/}
                <div className="card" style={{marginBottom: 12}}>
                  <div className="card-header">
                    <div className="form-group row" style={{marginBottom: 0}}>
                      <label htmlFor="fixedCost" className="col-sm-4 col-form-label"><b>Fixed Costs</b></label>
                      <div className="input-group col-sm-8">
                        <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                        <input readOnly type="text" className="form-control" id="costPerDay" value={
                          (+this.state.metrics.costs.fixedCosts.locationPrep +
                            +this.state.metrics.costs.fixedCosts.toePrep +
                            +this.state.metrics.costs.fixedCosts.fracFixedCosts
                          ) || ""
                        }/>
                        <div className="input-group-append"><span className="input-group-text">per Well</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body" style={{paddingBottom: 0}}>

                    <div className="form-group row">
                      <label htmlFor="locationPrep" className="col-sm-4 col-form-label">Location Prep</label>
                      <div className="input-group col-sm-8">
                        <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                        <input type="text" className="form-control" id="locationPrep" pattern={this.regexNum} value={this.state.metrics.costs.fixedCosts.locationPrep} onChange={(e) => this.handleCostChange(e, "fixedCosts")} required/>
                        <div className="input-group-append"><span className="input-group-text">per Well</span></div>
                        <div className="invalid-feedback">Please enter a number.</div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="toePrep" className="col-sm-4 col-form-label">Toe Prep</label>
                      <div className="input-group col-sm-8">
                        <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                        <input type="text" className="form-control" id="toePrep" pattern={this.regexNum} value={this.state.metrics.costs.fixedCosts.toePrep} onChange={(e) => this.handleCostChange(e, "fixedCosts")} required/>
                        <div className="input-group-append"><span className="input-group-text">per Well</span></div>
                        <div className="invalid-feedback">Please enter a number.</div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="fracFixedCosts" className="col-sm-4 col-form-label">Frac Fixed Costs</label>
                      <div className="input-group col-sm-8">
                        <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                        <input type="text" className="form-control" id="fracFixedCosts" pattern={this.regexNum} value={this.state.metrics.costs.fixedCosts.fracFixedCosts} onChange={(e) => this.handleCostChange(e, "fixedCosts")} required/>
                        <div className="input-group-append"><span className="input-group-text">per Well</span></div>
                        <div className="invalid-feedback">Please enter a number.</div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* ADDITIONAL COSTS PER STAGE */}
                <div className="card" style={{marginBottom: 12}}>
                  <div className="card-header">
                    <div className="form-group row" style={{marginBottom: 0}}>
                      <label htmlFor="costsPerStage" className="col-sm-4 col-form-label"><b>Costs per Stage</b></label>
                      <div className="input-group col-sm-8">
                        <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                        <input readOnly type="text" className="form-control" id="costsPerStage" value={
                          (+this.state.metrics.costs.costsPerStage.wireline +
                            +this.state.metrics.costs.costsPerStage.plugs +
                            +this.state.metrics.costs.costsPerStage.isolationTool
                          ) || ""
                        }/>
                        <div className="input-group-append"><span className="input-group-text">per Stage</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body" style={{paddingBottom: 0}}>

                    <div className="form-group row">
                      <label htmlFor="wireline" className="col-sm-4 col-form-label">Location Prep</label>
                      <div className="input-group col-sm-8">
                        <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                        <input type="text" className="form-control" id="wireline" pattern={this.regexNum} value={this.state.metrics.costs.costsPerStage.wireline} onChange={(e) => this.handleCostChange(e, "costsPerStage")} required/>
                        <div className="input-group-append"><span className="input-group-text">per Stage</span></div>
                        <div className="invalid-feedback">Please enter a number.</div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="plugs" className="col-sm-4 col-form-label">Toe Prep</label>
                      <div className="input-group col-sm-8">
                        <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                        <input type="text" className="form-control" id="plugs" pattern={this.regexNum} value={this.state.metrics.costs.costsPerStage.plugs} onChange={(e) => this.handleCostChange(e, "costsPerStage")} required/>
                        <div className="input-group-append"><span className="input-group-text">per Stage</span></div>
                        <div className="invalid-feedback">Please enter a number.</div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="isolationTool" className="col-sm-4 col-form-label">Isolation Tool</label>
                      <div className="input-group col-sm-8">
                        <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                        <input type="text" className="form-control" id="isolationTool" pattern={this.regexNum} value={this.state.metrics.costs.costsPerStage.isolationTool} onChange={(e) => this.handleCostChange(e, "costsPerStage")} required/>
                        <div className="input-group-append"><span className="input-group-text">per Stage</span></div>
                        <div className="invalid-feedback">Please enter a number.</div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* WATER COST PER BBL */}
                <div className="card">
                  <div className="card-header">
                    <div className="form-group row" style={{marginBottom: 0}}>
                      <label htmlFor="costsPerStage" className="col-sm-4 col-form-label"><b>Water Cost per BBL</b></label>
                      <div className="input-group col-sm-8">
                        <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                        <input readOnly type="text" className="form-control" id="costsPerStage" value={
                          ((this.state.metrics.costs.waterCostPerBBL.freshWaterPct * this.state.metrics.costs.waterCostPerBBL.freshWaterCostPerBBL +
                            this.state.metrics.costs.waterCostPerBBL.recycledWaterPct * this.state.metrics.costs.waterCostPerBBL.recycledWaterCostPerBBL +
                            this.state.metrics.costs.waterCostPerBBL.totalDisposalPct * this.state.metrics.costs.waterCostPerBBL.saltWaterDisposalCostPerBBL
                          ) / 100).toFixed(2) || ""
                        }/>
                        <div className="input-group-append"><span className="input-group-text">per BBL Water</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body" style={{paddingBottom: 0}}>

                    <div className="form-group row">
                      <label htmlFor="freshWaterPct" className="col-sm-4 col-form-label">Fresh Water %</label>
                      <div className="input-group col-sm-8">
                        <input type="text" className="form-control" id="freshWaterPct" pattern={this.regexPct} value={this.state.metrics.costs.waterCostPerBBL.freshWaterPct} onChange={(e) => this.handleCostChange(e, "waterCostPerBBL")} required/>
                        <div className="input-group-append"><span className="input-group-text">%</span></div>
                        <div className="invalid-feedback">Please enter a number.</div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="freshWaterCostPerBBL" className="col-sm-4 col-form-label">Fresh Water Cost</label>
                      <div className="input-group col-sm-8">
                        <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                        <input type="text" className="form-control" id="freshWaterCostPerBBL" pattern={this.regexNum} value={this.state.metrics.costs.waterCostPerBBL.freshWaterCostPerBBL} onChange={(e) => this.handleCostChange(e, "waterCostPerBBL")} required/>
                        <div className="input-group-append"><span className="input-group-text">per BBL</span></div>
                        <div className="invalid-feedback">Please enter a number.</div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="recycledWaterPct" className="col-sm-4 col-form-label">Recycled Water %</label>
                      <div className="input-group col-sm-8">
                        <input type="text" className="form-control" id="recycledWaterPct" pattern={this.regexPct} value={this.state.metrics.costs.waterCostPerBBL.recycledWaterPct} onChange={(e) => this.handleCostChange(e, "waterCostPerBBL")} required/>
                        <div className="input-group-append"><span className="input-group-text">%</span></div>
                        <div className="invalid-feedback">Please enter a number.</div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="recycledWaterCostPerBBL" className="col-sm-4 col-form-label">Recycled Water Cost</label>
                      <div className="input-group col-sm-8">
                        <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                        <input type="text" className="form-control" id="recycledWaterCostPerBBL" pattern={this.regexNum} value={this.state.metrics.costs.waterCostPerBBL.recycledWaterCostPerBBL} onChange={(e) => this.handleCostChange(e, "waterCostPerBBL")} required/>
                        <div className="input-group-append"><span className="input-group-text">per BBL</span></div>
                        <div className="invalid-feedback">Please enter a number.</div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="totalDisposalPct" className="col-sm-4 col-form-label">Salt Water Disposal %</label>
                      <div className="input-group col-sm-8">
                        <input type="text" className="form-control" id="totalDisposalPct" pattern={this.regexPct} value={this.state.metrics.costs.waterCostPerBBL.totalDisposalPct} onChange={(e) => this.handleCostChange(e, "waterCostPerBBL")} required/>
                        <div className="input-group-append"><span className="input-group-text">%</span></div>
                        <div className="invalid-feedback">Please enter a number.</div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="saltWaterDisposalCostPerBBL" className="col-sm-4 col-form-label">Salt Water Disposal Cost</label>
                      <div className="input-group col-sm-8">
                        <div className="input-group-prepend"><span className="input-group-text">$</span></div>
                        <input type="text" className="form-control" id="saltWaterDisposalCostPerBBL" pattern={this.regexNum} value={this.state.metrics.costs.waterCostPerBBL.saltWaterDisposalCostPerBBL} onChange={(e) => this.handleCostChange(e, "waterCostPerBBL")} required/>
                        <div className="input-group-append"><span className="input-group-text">per BBL</span></div>
                        <div className="invalid-feedback">Please enter a number.</div>
                      </div>
                    </div>

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

export default FracMetricsView