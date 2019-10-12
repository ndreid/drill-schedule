import React, { Component } from 'react'
import { Table } from 'react-omni-table';
import { _Date } from 'data-type-ext'
import { Pad, Well } from '../../../types'

interface Props {
  pads: Pad[]
  wells: Well[]
  onContextMenuClick: Function
}

class TableViewPadBullpen extends Component<Props> {
  getData() {
    let data = []

    const getWellsData = (padID: number) => {
      let wells = this.props.wells.filter(w => w.padID === padID).sort((w1, w2) => {
        let a = w1.vertDrillOrder, b = w2.vertDrillOrder
        return (+!a-+!b || +(a>b) || -(a<b))
      })
      if (wells.length === 0)
        return undefined
      let data = []
      
      for (let well of wells) {
        data.push({
          id: well.wellID,
          gisID: well.lateralID,
          name: well.wellName,
        })
      }
      return data
    }
    for (let pad of this.props.pads) {
      let children = getWellsData(pad.padID)
      let isLastSplitPad = pad.isSplit && this.props.pads.filter(p => p.gisPadID === pad.gisPadID).map(p => p.activityCode).sort((a, b) => a-b).pop() === pad.activityCode
      data.push({
        id: pad.padID,
        gisID: pad.gisPadID,
        name: pad.padName,
        children,
        settings: {
          contextMenuOptions: pad.temp ? undefined
            : pad.isSplit && pad.activityCode > 0 ? ['Split Pad', 'Delete Pad']
            : ['Split Pad'],
          disabledContextMenuOptions: !isLastSplitPad || pad.isSplit && pad.activityCode > 0 && children && children.length > 0 ? ['Delete Pad'] : undefined,
        }
      })
    }

    data.sort((l,r) => {
      let a = l.name, b = r.name
      return (+!a)-(+!b) || +(a>b) || -(a<b) 
    })

    return data
  }

  columns = [
    {
      name: 'Bullpen', dataIndex: 'gisID', dataType: 'string',
      style: { width: '8em' }
    },
    {
      name: '', dataIndex: 'name', dataType: 'string',
      style: { width: '20em' }
    },
  ]
  
  settings = {
    tableWidth: '100%',
    dragEnabled: true,
  }

  render() {
    return (
      <Table tableId={'bullpen'}
             columns={this.columns}
             data={this.getData()}
             onContextMenuClick={this.props.onContextMenuClick}
             rowHeight={26}
             settings={this.settings}
      />
    )
  }
}

export default TableViewPadBullpen