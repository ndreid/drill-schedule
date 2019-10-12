import React, { Component } from 'react'
import { connect } from 'react-redux'
import { StoreState, Pad } from '../../types';
import { DragDropArea, Table } from 'react-omni-table'
import { setPadName } from '../../redux/actions/pad-actions';
import { Thunk, mapActionToProp } from '../../redux/middleware/batched-thunk';

interface StateProps {
  pads: Pad[]
}
interface DispatchProps {
  setPadName: Thunk<typeof setPadName>
}
class RawDataView extends Component<StateProps & DispatchProps> {
  constructor(props) {
    super(props)

    this.handleCellInput = this.handleCellInput.bind(this)
  }

  handleCellInput({dataIndex, input, id} : { dataIndex: string, input: any, id: number}) {
    switch(dataIndex) {
      case 'padName': 
        this.props.setPadName(id, input)
        break
      default: throw Error('PadDataView is not configured to handle Cell input for Data Index ' + dataIndex)
    }
  }

  render() {
    let data = this.props.pads.map(p => ({
      id: p.padID,
      gisPadID: p.gisPadID,
      padName: p.padName,
    }))
    return (
      <DragDropArea>
        <Table tableId='pad' columns={columns} data={data} settings={settings} onCellInput={this.handleCellInput} rowHeight={26}/>
      </DragDropArea>
    )
  }
}
const mapStateToProps = (state: StoreState) => ({
  pads: Object.values(state.pads).filter(p => !p.temp && !p.isSplit)
})

const mapDispatchToProps = dispatch => ({
  setPadName: mapActionToProp(setPadName, dispatch)
})

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(RawDataView)


const columns = [
  {
    name: 'GIS Pad ID', dataIndex: 'gisPadID', dataType: 'number',
    style: { width: '8rem' },
  },
  {
    name: 'Pad Name', dataIndex: 'padName', dataType: 'string', editable: true,
    style: { width: '20rem' },
  },
]

const settings = {
  tierColors: [
    { color: 'black', backgroundColor: 'white' }  
  ]
}