import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { selectScheduleType } from '../redux/actions/scheduleType-actions'
import { ScheduleType } from '../types';
import { _String } from 'data-type-ext'
import { mapActionToProp, Thunk } from '../redux/middleware/batched-thunk';

interface OwnProps {
  scheduleType: ScheduleType
  hidePadSchedule: boolean
  viewNum: number
}
interface DispatchProps {
  selectScheduleType: Thunk<typeof selectScheduleType>
}

class ScheduleShell extends PureComponent<OwnProps & DispatchProps> {
  static defaultProps = { hidePadSchedule: false }  
  constructor(props) {
    super(props)
    this.handleScheduleTypeChange = this.handleScheduleTypeChange.bind(this)
  }

  handleScheduleTypeChange(e) {
    this.props.selectScheduleType(this.props.viewNum, e.currentTarget.value)
  }

  render() {
    return (
      <div className="fb-col-nowrap" style={{maxWidth:'100%', height:'100%', maxHeight:'100%'}}>
        <div className="fb-row-nowrap fi-def" style={{ maxHeight:30, marginBottom:16}}>
          <label htmlFor="inputSchedule" className="col-form-label" style={{marginRight:8}}>Schedule:</label>
          <select value={this.props.scheduleType} className="form-control" id="inputSchedule" onChange={this.handleScheduleTypeChange} style={{maxWidth: "200px"}}>
            {Object.values(ScheduleType).map((st: string) => {
              return st === ScheduleType.Lateral && this.props.hidePadSchedule ? undefined : <option key={st} value={st}>{_String.spaceCamelCase(st)}</option>
            })}
          </select>
          {/* <FormGroup>
            <FormLabel>Schedule Type</FormLabel>
            <FormControl as='select' value={''+this.props.scheduleType} onChange={this.handleScheduleTypeChange}>
              {Object.entries(ScheduleType).map(([st, stId]) =>
                stId === ScheduleType.Pad && this.props.hidePadSchedule
                  ? undefined
                  : <option key={stId} value={stId}>{st.replace(/([A-Z])/g, ' $1').trim()}</option>
              )}
            </FormControl>
          </FormGroup> */}
        </div>
        <div style={{height: 'calc(100% - 45px', display: 'flex'}}>
        {/* <div style={{maxHeight:'calc(100vh - 138px)', display: 'flex'}}> */}
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  selectScheduleType: mapActionToProp(selectScheduleType, dispatch)
})

export default connect<null, DispatchProps, OwnProps>(null, mapDispatchToProps)(ScheduleShell);
