import React, { Component } from 'react'
import { StoreState, Wells, AFEType } from '../types';
import { connect } from 'react-redux';
import { DragDropArea, Table } from 'react-omni-table';
import { _Number } from 'data-type-ext'
import { setWellAFE } from '../redux/actions/well-actions'
import { Thunk, mapActionToProp } from '../redux/middleware/batched-thunk';

interface StateProps {
  wells: Wells
}
interface DispatchProps {
  setWellAFE: Thunk<typeof setWellAFE>
}
class AFEView extends Component<StateProps & DispatchProps> {
  constructor(props) {
    super(props)

    this.handleCellInput = this.handleCellInput.bind(this)
  }

  handleCellInput({ dataIndex, input, id }: { dataIndex: AFEType, input: any, id: number }) {
    console.log('handleCellInput', dataIndex, input, id)
    this.props.setWellAFE(id, dataIndex, input)
  }

  columns = [
    { name: 'Lateral ID', dataIndex: 'lateralID', dataType: 'number', style: { width: '10rem' } },
    { name: 'Lateral Name', dataIndex: 'wellName', dataType: 'string', style: { width: '16rem' } },
    { name: 'Constr. AFE', dataIndex: 'construction', dataType: 'number', editable: true, style: { width: '9rem', align: 'right' } },
    { name: 'Vert Drill AFE', dataIndex: 'vertDrill', dataType: 'number', editable: true, style: { width: '9rem', align: 'right' } },
    { name: 'Horz Drill AFE', dataIndex: 'horzDrill', dataType: 'number', editable: true, style: { width: '9rem', align: 'right' } },
    { name: 'Drill Rehab AFE', dataIndex: 'drillRehab', dataType: 'number', editable: true, style: { width: '9rem', align: 'right' } },
    { name: 'Frac AFE', dataIndex: 'frac', dataType: 'number', editable: true, style: { width: '9rem', align: 'right' } },
    { name: 'Comp. Rehab AFE', dataIndex: 'completionsRehab', dataType: 'number', editable: true, style: { width: '9rem', align: 'right' } },
    { name: 'Water Transfer AFE', dataIndex: 'waterTransfer', dataType: 'number', editable: true, style: { width: '9rem', align: 'right' } },
    { name: 'Drill Out AFE', dataIndex: 'drillOut', dataType: 'number', editable: true, style: { width: '9rem', align: 'right' } },
    { name: 'Facilities AFE', dataIndex: 'facilities', dataType: 'number', editable: true, style: { width: '9rem', align: 'right' } },
    { name: 'Flowback AFE', dataIndex: 'flowback', dataType: 'number', editable: true, style: { width: '9rem', align: 'right' } },
    { name: 'Calc Constr. Cost', dataIndex: 'constructionCost', dataType: 'number', style: { width: '9rem', align: 'right' } },
    { name: 'Calc Vert Drill Cost', dataIndex: 'vertDrillCost', dataType: 'number', style: { width: '9rem', align: 'right' } },
    { name: 'Calc Horz Drill Cost', dataIndex: 'horzDrillCost', dataType: 'number', style: { width: '9rem', align: 'right' } },
    { name: 'Calc Drill Rehab Cost', dataIndex: 'drillRehabCost', dataType: 'number', style: { width: '9rem', align: 'right' } },
    { name: 'Calc Frac Cost', dataIndex: 'fracCost', dataType: 'number', style: { width: '9rem', align: 'right' } },
    { name: 'Calc Comp. Rehab Cost', dataIndex: 'completionsRehabCost', dataType: 'number', style: { width: '9rem', align: 'right' } },
    { name: 'Calc Water Transfer Cost', dataIndex: 'waterTransferCost', dataType: 'number', style: { width: '9rem', align: 'right' } },
    { name: 'Calc Drill Out Cost', dataIndex: 'drillOutCost', dataType: 'number', style: { width: '9rem', align: 'right' } },
    { name: 'Calc Facilities Cost', dataIndex: 'facilitiesCost', dataType: 'number', style: { width: '9rem', align: 'right' } },
    { name: 'Calc Flowback Cost', dataIndex: 'flowbackCost', dataType: 'number', style: { width: '9rem', align: 'right' } },
  ]
  settings = {
    dragEnabled: false,
    tierColors: [
      { color: 'black', backgroundColor: 'white' }
    ]
  }
  render() {
    
    let data = Object.values(this.props.wells).reduce((d, w) => {
      d.push({
        id: w.wellID,
        lateralID: w.lateralID,
        wellName: w.wellName,
        construction: _Number.toCurrency(w.afes.construction, 0),
        vertDrill: _Number.toCurrency(w.afes.vertDrill, 0),
        horzDrill: _Number.toCurrency(w.afes.horzDrill, 0),
        drillRehab: _Number.toCurrency(w.afes.drillRehab, 0),
        frac: _Number.toCurrency(w.afes.frac, 0),
        completionsRehab: _Number.toCurrency(w.afes.completionsRehab, 0),
        waterTransfer: _Number.toCurrency(w.afes.waterTransfer, 0),
        drillOut: _Number.toCurrency(w.afes.drillOut, 0),
        facilities: _Number.toCurrency(w.afes.facilities, 0),
        flowback: _Number.toCurrency(w.afes.flowback, 0),
        constructionCost: _Number.toCurrency(w.constructionCost, 0),
        vertDrillCost: _Number.toCurrency(w.vertDrillCost, 0),
        horzDrillCost: _Number.toCurrency(w.horzDrillCost, 0),
        drillRehabCost: _Number.toCurrency(w.drillRehabCost, 0),
        fracCost: _Number.toCurrency(w.fracCost, 0),
        completionsRehabCost: _Number.toCurrency(w.completionsRehabCost, 0),
        waterTransferCost: _Number.toCurrency(w.waterTransferCost, 0),
        drillOutCost: _Number.toCurrency(w.drillOutCost, 0),
        facilitiesCost: _Number.toCurrency(w.facilitiesCost, 0),
        flowbackCost: _Number.toCurrency(w.flowbackCost, 0),
      })
      return d
    }, [])
    return (
      <div style={{ maxHeight: 'calc(100vh - 92px)', display: 'flex' }}>
        <DragDropArea>
          <Table tableId='afe' columns={this.columns} data={data} rowHeight={26} settings={this.settings} onCellInput={this.handleCellInput}/>
        </DragDropArea>
      </div>
    )
  }
}

const mapStateToProps = (state: StoreState) => ({
  wells: state.wells
})

const mapDispatchToProps = dispatch => ({
  setWellAFE: mapActionToProp(setWellAFE, dispatch)
})

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(AFEView)