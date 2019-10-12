import React, { Component } from 'react'
import { connect } from 'react-redux'
import { movePad, setPadManualStartDate, setPadManualDuration, setPadManualDelay } from '../../redux/actions/pad-actions'
import padHelper from '../../helpers/pad-helper'
import tableViewHelper from '../../helpers/tableView-helper';
import { DragDropArea, Table } from 'react-omni-table';
import { _Date } from 'data-type-ext'
import { ScheduleType, ScheduleMetricsBase, Pad, StoreState } from '../../types';
import { Thunk, mapActionToProp } from '../../redux/middleware/batched-thunk';

interface OwnProps {
  scheduleType: ScheduleType
}
interface StateProps {
  pads: Pad[]
  crews: Record<number, string>
  metrics: ScheduleMetricsBase
}
interface DispatchProps {
  movePad: Thunk<typeof movePad>
  setPadManualStartDate: Thunk<typeof setPadManualStartDate>
  setPadManualDuration: Thunk<typeof setPadManualDuration>
  setPadManualDelay: Thunk<typeof setPadManualDelay>
}

class TableViewBase extends Component<OwnProps & StateProps & DispatchProps> {
  constructor(props) {
    super(props)
    
    this.getTableData = this.getTableData.bind(this)
    this.handleCellInput = this.handleCellInput.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
  }

  handleCellInput({dataIndex, input, id} : { dataIndex: string, input: any, id: number}) {
    switch (dataIndex) {
      case 'manualStart':
        this.props.setPadManualStartDate(id, this.props.scheduleType, input)
        break
      case 'manualDuration':
        this.props.setPadManualDuration(id, this.props.scheduleType, input)
        break
      case 'manualDelay':
        this.props.setPadManualDelay(id, this.props.scheduleType, input)
        break
      default: throw Error('TableViewBase Component is not configured to handle Cell input for Data Index ' + dataIndex)
    }
  }

  handleDrop({ source, target }) {
    let targetPadID: number, targetPad: Pad, crewID: number

    switch (target.parentIds.length) {
      case 0: // Target is top of Crew
        crewID = +target.id
      break
      case 1: // Target is Pad
        targetPadID = +target.id
        targetPad = this.props.pads.find(p => p.padID === targetPadID)
        crewID = targetPad.crews[this.props.scheduleType] ? +targetPad.crews[this.props.scheduleType] : undefined
      break
      default: throw Error("TableViewBase.jsx handleDrop() is not configured to handle a target with " + target.parentIds.length + " parent IDs.")
    }

    this.props.movePad(this.props.scheduleType, +source.id, targetPadID, crewID)
  }

  getTableData() {
    var crewsArray = []
    for (let [id, crewName] of Object.entries(this.props.crews)) {
      let crewID = +id
      var pads = this.props.pads.filter(pad =>
        pad.crews[this.props.scheduleType] === crewID
      )

      if (pads.length === 0) {
        crewsArray.push(tableViewHelper[this.props.scheduleType].crewData(crewID, crewName, undefined, undefined))
        continue
      }

      var padsWOPredecessors = pads.filter(p =>
        p.crews[this.props.scheduleType] === crewID
        && !p.predecessors[this.props.scheduleType]
      )
      
      if (padsWOPredecessors.length !== 1) {
        throw new Error("Found " + padsWOPredecessors.length + " Pads without Predecessors on the " + this.props.scheduleType + " schedule on CrewID '" + crewID + "'.")
      }

      var padsWOSuccessors = pads.filter(p => {
        return p.crews.hasOwnProperty(this.props.scheduleType)
            && p.crews[this.props.scheduleType] === crewID
            && !p.successors.hasOwnProperty(this.props.scheduleType)
      })

      if (padsWOSuccessors.length !== 1) {
        throw new Error("Found " + padsWOSuccessors.length + " Pads without Successors on the " + this.props.scheduleType + " schedule on CrewID '" + crewID + "'.")
      }
  
      let crewStart = padHelper.getScheduleStartDate(padsWOPredecessors[0], this.props.scheduleType)
      let crewEnd = padHelper.getScheduleEndDate(padsWOSuccessors[0], this.props.scheduleType)
      let crewData = tableViewHelper[this.props.scheduleType].crewData(crewID, crewName, crewStart, crewEnd);
      
      var padsArray = []
      this.fillPadsArrayRec(padsWOPredecessors[0], padsArray)
      
      if (padsArray.length > 0) {
        crewData['children'] = padsArray
      }

      crewsArray.push(crewData)
    }

    var unassignedPads = this.props.pads.filter(p => {
      return !p.crews.hasOwnProperty(this.props.scheduleType)
    })

    if (unassignedPads.length > 0) {
      unassignedPads.sort((padA, padB) => {
        let a = padHelper.getScheduleStartDate(padA, this.props.scheduleType)
        let b = padHelper.getScheduleStartDate(padB, this.props.scheduleType)
        return !a && !b ? padA.padName.localeCompare(padB.padName) : !a && b ? 1 : a && !b ? -1 : _Date.diff(a, b)
      })

      
      let minDate = padHelper.getScheduleStartDate(unassignedPads[0], this.props.scheduleType)
      let maxDate = padHelper.getScheduleEndDate(unassignedPads.slice(-1)[0], this.props.scheduleType)
      let unassignedData = tableViewHelper[this.props.scheduleType].crewData(0, 'unassigned', minDate, maxDate)
      
      var unassignedPadsArray = []
      for (let pad of unassignedPads) {
        unassignedPadsArray.push(tableViewHelper[this.props.scheduleType].padData(pad, this.props.metrics.timing.moveTime))
      }

      if (unassignedPadsArray.length > 0) {
        unassignedData['children'] = unassignedPadsArray
      }

      crewsArray.push(unassignedData)
    } else {
      crewsArray.push(tableViewHelper[this.props.scheduleType].crewData(0, 'unassigned', undefined, undefined))
    }

    return crewsArray
  }

  fillPadsArrayRec(pad: Pad, array: any[]) {
    array.push(tableViewHelper[this.props.scheduleType].padData(pad, this.props.metrics.timing.moveTime))

    if (!pad.successors.hasOwnProperty(this.props.scheduleType)) { return }

    let nextPad = this.props.pads.find(p => p.padID === pad.successors[this.props.scheduleType])
    this.fillPadsArrayRec(nextPad, array)
  }

  render() {
    let columns = tableViewHelper[this.props.scheduleType].columns
    let data = this.getTableData()
    const settings = {
      dragEnabled: true,
    }
    return (
      <DragDropArea key={this.props.scheduleType} onDrop={this.handleDrop}>
        <Table tableId={this.props.scheduleType} columns={columns} data={data} settings={settings} onCellInput={this.handleCellInput} rowHeight={26}/>
      </DragDropArea>
      )
  }
}

const mapStateToProps = (state: StoreState, props: OwnProps) => ({
  pads: Object.values(state.pads).filter(p => p.isScheduled),
  crews: state.crews[props.scheduleType],
  metrics: state.metrics[props.scheduleType],
})

const mapDispatchToProps = dispatch => ({
  movePad: mapActionToProp(movePad, dispatch),
  setPadManualStartDate: mapActionToProp(setPadManualStartDate, dispatch),
  setPadManualDuration: mapActionToProp(setPadManualDuration, dispatch),
  setPadManualDelay: mapActionToProp(setPadManualDelay, dispatch),
})

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(TableViewBase)