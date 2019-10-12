import React, { Component } from 'react'
import PadDataView from './PadDataView';
import WellDataView from './WellDataView';

interface State {
  sourceType: string
}
class SourceDataView extends Component<{}, State> {
  constructor(props) {
    super(props)

    this.state = {
      sourceType: 'Well'
    }

    this.handleSourceTypeChange = this.handleSourceTypeChange.bind(this)
  }

  handleSourceTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ sourceType: e.currentTarget.value })
  }

  render() {
    return (
      <div className="fb-col-nowrap" style={{maxWidth:'100%', height:'100%', maxHeight:'100%'}}>
        <div className="fb-row-nowrap fi-def" style={{ maxHeight:30, marginBottom:16}}>
          <label htmlFor="sourceType" className="col-form-label" style={{marginRight:8}}>Source Type:</label>
          <select value={this.state.sourceType} className="form-control" id="sourceType" onChange={this.handleSourceTypeChange} style={{maxWidth: "200px"}}>
            <option value='Pad'>Pad</option>
            <option value='Well'>Well</option>
          </select>
        </div>
        <div style={{maxHeight:'calc(100vh - 138px)', display:'flex'}}>
          {this.state.sourceType === 'Pad'
            ? <PadDataView/>
            : <WellDataView/>
          }
        </div>
      </div>
    )
  }
}

export default SourceDataView