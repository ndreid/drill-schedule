import React, { Component } from 'react'
import TableViewPad from './Pad_View/TableView_Pad'
import TableViewBase from './TableViewBase'
import { ScheduleType } from '../../types';

interface Props {
  scheduleType: ScheduleType
}

class TableView extends Component<Props> {
  render() {
    return this.props.scheduleType === ScheduleType.Lateral
      ? <TableViewPad />
      : <TableViewBase scheduleType={this.props.scheduleType}/>
  }
}

export default TableView
