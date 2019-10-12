import React, { Component } from 'react'

import { DurationType, Pad, Well, Wells, Pads } from '../../../types'

import { Table } from 'react-omni-table';
import { _Date, _Number } from 'data-type-ext'
import { setBatchDrillFlag } from '../../../redux/actions/pad-actions';
import { Thunk } from '../../../redux/middleware/batched-thunk';
import { setWellVertDrillDurationManual, setWellHorzDrillDurationManual, setWellVertDrillOrderManual, setWellHorzDrillOrderManual, setWellSurfaceLocation } from '../../../redux/actions/well-actions';

interface Props {
  stateCode: string
  pads: Pad[]
  wells: Well[]
  onContextMenuClick: Function
  setBatchDrillFlag: Thunk<typeof setBatchDrillFlag>
  setWellVertDrillOrderManual: Thunk<typeof setWellVertDrillOrderManual>
  setWellHorzDrillOrderManual: Thunk<typeof setWellHorzDrillOrderManual>
  setWellVertDrillDurationManual: Thunk<typeof setWellVertDrillDurationManual>
  setWellHorzDrillDurationManual: Thunk<typeof setWellHorzDrillDurationManual>
  setWellSurfaceLocation: Thunk<typeof setWellSurfaceLocation>
}

class TableViewPadSchedule extends Component<Props> {
  constructor (props) {
    super(props)
    this.handleCellInput = this.handleCellInput.bind(this)
  }

  handleCellInput({ dataIndex, input, id }: { dataIndex: string, input: any, id: number }) {
    let wells: Wells = this.props.wells.reduce((obj, w) => { obj[w.wellID] = w; return obj} ,{})
    let pads: Pads = this.props.pads.reduce((obj, p) => { obj[p.padID] = p; return obj} ,{})
    switch (dataIndex) {
      case 'batchDrill':
        if (pads[id].batchDrill !== input)
          this.props.setBatchDrillFlag(id, input)
        break
      case 'batchDrillVertOrder':
        if (wells[id].vertDrillOrderManual !== input)
          this.props.setWellVertDrillOrderManual(id, input)
        break
      case 'batchDrillHorzOrder':
        if (wells[id].horzDrillOrderManual !== input)
          this.props.setWellHorzDrillOrderManual(id, input)
        break
      case 'manualVertDrillDuration':
        if (wells[id].manualDurations[DurationType.VertDrill] !== input)
          this.props.setWellVertDrillDurationManual(id, input)
        break
      case 'manualHorzDrillDuration':
        if (wells[id].manualDurations[DurationType.HorzDrill] !== input)
          this.props.setWellHorzDrillDurationManual(id, input)
        break
      case 'surfaceLocation':
        if (wells[id].surfaceLocation !== input)
          this.props.setWellSurfaceLocation(id, input)
        break
      default: throw Error('TableViewPad Component is not configured to handle Cell input for Data Index ' + dataIndex)
    }
  }

  getPadScheduleContents() {
    let pads = this.props.pads.sort((left, right) => {    
      let a = left.drillStart, b = right.drillStart
      //@ts-ignore
      return (!a)-(!b) || +(a>b)||-(a<b)
    })

    let data = []
    let allWells = this.props.wells
    for (let pad of pads) {
      let wells = allWells.filter(w => w.padID === pad.padID).sort((w1, w2) => {
        let a = w1.vertDrillOrder, b = w2.vertDrillOrder
        return (+!a-+!b || +(a>b) || -(a<b))
        // return !_Number.isNumber(a) && !_Number.isNumber(b) ? 0
        //   : !_Number.isNumber(a) ? 1
        //   : !_Number.isNumber(b) ? -1
        //   : a - b
      })
      
      let children = wells.map(well => ({
        id: well.wellID,
        objID: well.lateralID,
        name: well.wellName,
        batchDrillVertOrder: well.vertDrillOrderManual,
        batchDrillHorzOrder: well.horzDrillOrderManual,
        drillDuration: well.drillDuration,
        manualVertDrillDuration: well.manualDurations[DurationType.VertDrill],
        manualHorzDrillDuration: well.manualDurations[DurationType.HorzDrill],
        surfaceLocation: well.surfaceLocation,
        vertDrillStart: _Date.format(well.vertDrillStart),
        vertDrillEnd: _Date.format(well.vertDrillEnd),
        horzDrillStart: _Date.format(well.horzDrillStart),
        horzDrillEnd: _Date.format(well.horzDrillEnd),
        fracStart: _Date.format(well.fracStart),
        fracEnd: _Date.format(well.fracEnd),
        drillOutStart: _Date.format(well.drillOutStart),
        drillOutEnd: _Date.format(well.drillOutEnd),
        facilitiesStart: _Date.format(well.facilitiesStart),
        facilitiesEnd: _Date.format(well.facilitiesEnd),
        til: _Date.format(well.til),
        firstFlow: _Date.format(well.firstFlow),
        cellOverrideProps: [{
            dataIndex: 'batchDrill',
            dataType: 'string',
            editable: false,
        }]
      }))

      let isLastSplitPad = pad.isSplit && pads.filter(p => p.gisPadID === pad.gisPadID).map(p => p.activityCode).sort((a, b) => a-b).pop() === pad.activityCode

      data.push({
        id: pad.padID,
        objID: pad.gisPadID,
        name: pad.padName,
        batchDrill: pad.batchDrill,
        drillDuration: pad.drillDuration,
        vertDrillStart: _Date.format(pad.drillStart),
        horzDrillEnd: _Date.format(pad.drillEnd),
        fracStart: _Date.format(pad.fracStart),
        fracEnd: _Date.format(pad.fracEnd),
        drillOutStart: _Date.format(pad.drillOutStart),
        drillOutEnd: _Date.format(pad.drillOutEnd),
        facilitiesStart: _Date.format(pad.facilitiesStart),
        facilitiesEnd: _Date.format(pad.facilitiesEnd),
        til: _Date.format(pad.til),
        firstFlow: _Date.format(pad.firstFlow),
        cellOverrideProps: [
          { dataIndex: 'batchDrillVertOrder', editable: false },
          { dataIndex: 'batchDrillHorzOrder', editable: false },
          { dataIndex: 'manualVertDrillDuration', editable: false },
          { dataIndex: 'manualHorzDrillDuration', editable: false },
          { dataIndex: 'surfaceLocation', editable: false }
        ],
        children: children.length > 0 ? children : undefined,
        settings: {
          contextMenuOptions: pad.temp ? undefined
            : pad.isSplit && pad.activityCode > 0 ? ['Split Pad', 'Delete Pad']
            : ['Split Pad'],
          disabledContextMenuOptions: !isLastSplitPad || pad.isSplit && pad.activityCode > 0 && children.length > 0 ? ['Delete Pad'] : undefined,
        }
      })
    }
    return data
  }

  getColumns = () => [
    {
      name: 'Pad', dataIndex: 'name', dataType: 'string',
      style: { width: '20em' }
    },
    {
      name: 'ID', dataIndex: 'objID', dataType: 'number',
      style: { width: '6em' }
    },
    {
      name: 'Batch Drill', dataIndex: 'batchDrill', dataType: 'bool', editable: true,
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Batch Drill Vert Order', dataIndex: 'batchDrillVertOrder', dataType: 'int', editable: true,
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Batch Drill Horz Order', dataIndex: 'batchDrillHorzOrder', dataType: 'int', editable: true,
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Drill Duration', dataIndex: 'drillDuration', dataType: 'number',
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Manual Vert Drill Duration', dataIndex: 'manualVertDrillDuration', dataType: 'number', editable: true,
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Manual Horz Drill Duration', dataIndex: 'manualHorzDrillDuration', dataType: 'number', editable: true,
      style: { width: '8em', align: 'center' },
    },
    this.props.stateCode === 'OH' ? {
      name: 'Surface Location', dataIndex: 'surfaceLocation', dataType: 'number', editable: true,
      style: { width: '8em', align: 'center' },
    }: undefined,
    {
      name: 'Vert Spud Date', dataIndex: 'vertDrillStart', dataType: 'date',
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Vert Drill End', dataIndex: 'vertDrillEnd', dataType: 'date',
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Horz Spud Date', dataIndex: 'horzDrillStart', dataType: 'date',
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Horz Drill End', dataIndex: 'horzDrillEnd', dataType: 'date',
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Frac Start', dataIndex: 'fracStart', dataType: 'date',
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Frac End', dataIndex: 'fracEnd', dataType: 'date',
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Drill Out Start', dataIndex: 'drillOutStart', dataType: 'date',
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Drill Out End', dataIndex: 'drillOutEnd', dataType: 'date',
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Facilities Start', dataIndex: 'facilitiesStart', dataType: 'date',
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'Facilities End', dataIndex: 'facilitiesEnd', dataType: 'date',
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'TIL', dataIndex: 'til', dataType: 'date',
      style: { width: '8em', align: 'center' },
    },
    {
      name: 'First Flow', dataIndex: 'firstFlow', dataType: 'date',
      style: { width: '8em', align: 'center' },
    },
  ].filter(Boolean)

  settings = {
    tableWidth: '100%',
    dragEnabled: true,
  }

  render() {
    return (
        <Table tableId='scheduled'
               columns={this.getColumns()}
               data={this.getPadScheduleContents()}
               onCellInput={this.handleCellInput}
               onContextMenuClick={this.props.onContextMenuClick}
               rowHeight={26}
               settings={this.settings}
        />
    )
  }
}

export default TableViewPadSchedule
