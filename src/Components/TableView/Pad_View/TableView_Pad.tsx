import React, { Component } from 'react'
import { connect } from 'react-redux'
import { _Date } from 'data-type-ext'
import { DragDropArea } from 'react-omni-table';

import { Pads, Wells, StoreState } from '../../../types'
import Schedule from './TableView_Pad_Schedule'
import Bullpen from './TableView_Pad_Bullpen'

import { setBatchDrillFlag, setIsScheduled, splitPad, unsplitPad, createTempPad } from '../../../redux/actions/pad-actions'
import { moveWell,
         setWellVertDrillOrderManual,
         setWellHorzDrillOrderManual,
         setWellVertDrillDurationManual,
         setWellHorzDrillDurationManual,
         setWellSurfaceLocation,
} from '../../../redux/actions/well-actions'
import { Thunk, mapActionToProp } from '../../../redux/middleware/batched-thunk';

interface StateProps {
  stateCode: string
  pads: Pads
  wells: Wells
}
interface DispatchProps {
  moveWell: Thunk<typeof moveWell>
  setBatchDrillFlag: Thunk<typeof setBatchDrillFlag>
  setIsScheduled: Thunk<typeof setIsScheduled>
  setWellVertDrillOrderManual: Thunk<typeof setWellVertDrillOrderManual>
  setWellHorzDrillOrderManual: Thunk<typeof setWellHorzDrillOrderManual>
  setWellVertDrillDurationManual: Thunk<typeof setWellVertDrillDurationManual>
  setWellHorzDrillDurationManual: Thunk<typeof setWellHorzDrillDurationManual>
  setWellSurfaceLocation: Thunk<typeof setWellSurfaceLocation>
  splitPad: Thunk<typeof splitPad>
  unsplitPad: Thunk<typeof unsplitPad>
  createTempPad: Thunk<typeof createTempPad>
}

class TableViewPad extends Component<StateProps & DispatchProps> {
  constructor (props) {
    super(props)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleContextMenuClick = this.handleContextMenuClick.bind(this)
  }

  handleDrop({ source, target }: {
    source: {
      id: string
      parentIds: string[]
      tableId: string
    }
    target: {
      id: string
      parentIds: string[]
      tableId: string
    }
  }) {
    // PAD: BULLPEN --> SCHEDULE
    if (source.tableId === 'bullpen' && source.parentIds.length === 0 && target.tableId === 'scheduled')
      this.props.setIsScheduled(+source.id, true)

    // PAD: SCHEDULE --> BULLPEN
    if (source.tableId === 'scheduled' && source.parentIds.length === 0 && target.tableId === 'bullpen')
      this.props.setIsScheduled(+source.id, false)

    // PAD: SCHEDULE --> SCHEDULE
      //ignore

    // PAD: BULLPEN --> BULLPEN
      //ignore

    // WELL: SCHEDULE/BULLPEN --> SCHEDULE/BULLPEN
    if ((source.tableId === 'scheduled' && source.parentIds.length === 1 || source.tableId === 'bullpen' && source.parentIds.length === 1 )
      && (target.tableId === 'scheduled' || target.tableId === 'bullpen')
    ) {
      console.log(target.id)
      if (target.id === undefined && this.props.stateCode === 'OH') { //Drag Well out of Pad
        this.props.createTempPad(+source.id)
      } else { //Drag Well into Pad
        let newPredWellID = target.parentIds.length === 1 ? +target.id : undefined
        let newPadID = target.parentIds.length === 0 ? +target.id : this.props.wells[+target.id].padID
        this.props.moveWell(+source.id, newPredWellID, newPadID)
      }
    }
  }

  handleContextMenuClick({ id, action }: { id: string, action: string }) {
    switch (action) {
      case 'Split Pad':
        this.props.splitPad(+id)
        break
      case 'Delete Pad':
        this.props.unsplitPad(+id)
        break
    }
  }

  render() {
    let pads = Object.values(this.props.pads)
    let wells = Object.values(this.props.wells)
    return (
      <DragDropArea width='100%' onDrop={this.handleDrop}>
        <div style={{ display: 'flex', width: '100%', height: '100%'}}>
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <Schedule stateCode={this.props.stateCode}
                      pads={pads.filter(p => p.isScheduled)}
                      wells={wells.filter(w => w.padID)}
                      onContextMenuClick={this.handleContextMenuClick}
                      setBatchDrillFlag={this.props.setBatchDrillFlag}
                      setWellVertDrillOrderManual={this.props.setWellVertDrillOrderManual}
                      setWellHorzDrillOrderManual={this.props.setWellHorzDrillOrderManual}
                      setWellVertDrillDurationManual={this.props.setWellVertDrillDurationManual}
                      setWellHorzDrillDurationManual={this.props.setWellHorzDrillDurationManual}
                      setWellSurfaceLocation={this.props.setWellSurfaceLocation}
            />
          </div>
          <div style={{ minWidth:'2rem', maxWidth: '2rem' }}></div>
          <div>
            <Bullpen pads={pads.filter(p => !p.isScheduled)}
                          wells={wells}
                          onContextMenuClick={this.handleContextMenuClick}
            />
          </div>
        </div>
      </DragDropArea>
    )
  }
}

const mapStateToProps = (state: StoreState) => ({
  stateCode: state.selectedStateCode,
  pads: state.pads,
  wells: state.wells,
})

const mapDispatchToProps = dispatch => ({
  moveWell: mapActionToProp(moveWell, dispatch),
  setBatchDrillFlag: mapActionToProp(setBatchDrillFlag, dispatch),
  setIsScheduled: mapActionToProp(setIsScheduled, dispatch),
  setWellVertDrillOrderManual: mapActionToProp(setWellVertDrillOrderManual, dispatch),
  setWellHorzDrillOrderManual: mapActionToProp(setWellHorzDrillOrderManual, dispatch),
  setWellVertDrillDurationManual: mapActionToProp(setWellVertDrillDurationManual, dispatch),
  setWellHorzDrillDurationManual: mapActionToProp(setWellHorzDrillDurationManual, dispatch),
  setWellSurfaceLocation: mapActionToProp(setWellSurfaceLocation, dispatch),
  splitPad: mapActionToProp(splitPad, dispatch),
  unsplitPad: mapActionToProp(unsplitPad, dispatch),
  createTempPad: mapActionToProp(createTempPad, dispatch),
})

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(TableViewPad)
