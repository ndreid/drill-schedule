import React, { Component } from 'react'
import { FlowbackMetrics } from '../../types';

interface Props {
  metrics: FlowbackMetrics
  saveChanges: Function
}
interface State {
  metrics: FlowbackMetrics
}

class FlowbackMetricsView extends Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      metrics: JSON.parse(JSON.stringify(this.props.metrics))
    }

    this.handleSubmit = this.handleSubmit.bind(this)
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
      var metrics: FlowbackMetrics = Object.assign({}, this.state.metrics)
      metrics.costs.fixedCosts = metrics.costs.fixedCosts
      this.props.saveChanges(metrics).then(() => {
        this.formRef.current.classList.remove('was-validated')
      })
    }
  }

  handleCostChange(event) {
    var metrics: FlowbackMetrics = Object.assign({}, this.state.metrics)
    metrics.costs[event.target.id] = event.target.value
    this.setState({ metrics: metrics })
  }

  render() {
    return (
      <form ref={this.formRef} autoComplete="off" noValidate onSubmit={this.handleSubmit} style={{ height: 'max-content', maxHeight: "calc(100% - 83px)"}}>
        <div className="fb-col-nowrap" style={{height: "100%", maxHeight: "100%"}}>

          {/* COSTS  */}
          <div className="fi-def" style={{height: "100%", maxHeight: "100%", maxWidth: "700px"}}>
            <div className="card" style={{marginBottom:16}}>
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
        <button type="submit" className="btn btn-lg btn-gpor-primary"><b>Save Changes</b></button>
      </form>
    )
  }
}

export default FlowbackMetricsView