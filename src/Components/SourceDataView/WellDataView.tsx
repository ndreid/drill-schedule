import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DragDropArea, Table } from 'react-omni-table'
import { StoreState, Well } from '../../types';
import { Thunk, mapActionToProp } from '../../redux/middleware/batched-thunk';
import { setGPWellNo, setWellWI, setLateralLength, setTVD, setTMD, setSpacingLeft, setSpacingRight, setFormation, setPhaseWindow, setDistrictTownship, setLateralSite, setUnitID, setUnit } from '../../redux/actions/well-actions';
import { _Number } from 'data-type-ext'

interface StateProps {
  stateCode: string
  wells: Well[]
}
interface DispatchProps {
  setGPWellNo: Thunk<typeof setGPWellNo>
  setWellWI: Thunk<typeof setWellWI>
  setLateralLength: Thunk<typeof setLateralLength>
  setTVD: Thunk<typeof setTVD>
  setTMD: Thunk<typeof setTMD>
  setSpacingLeft: Thunk<typeof setSpacingLeft>
  setSpacingRight: Thunk<typeof setSpacingRight>
  setFormation: Thunk<typeof setFormation>
  setPhaseWindow: Thunk<typeof setPhaseWindow>
  setDistrictTownship: Thunk<typeof setDistrictTownship>
  setLateralSite: Thunk<typeof setLateralSite>
  setUnitID: Thunk<typeof setUnitID>
  setUnit: Thunk<typeof setUnit>
}
class RawDataView extends Component<StateProps & DispatchProps> {
  constructor(props) {
    super(props)

    this.handleCellInput = this.handleCellInput.bind(this)
  }

  handleCellInput({dataIndex, input, id} : { dataIndex: string, input: any, id: number}) {
    switch (dataIndex) {
      case 'gpWellNo': this.props.setGPWellNo(id, input); break
      case 'workingInterest': this.props.setWellWI(id, input); break
      case 'lateralLength': this.props.setLateralLength(id, input); break
      case 'tvd': this.props.setTVD(id, input); break
      case 'tmd': this.props.setTMD(id, input); break
      case 'spacingLeft': this.props.setSpacingLeft(id, input); break
      case 'spacingRight': this.props.setSpacingRight(id, input); break
      case 'formation': this.props.setFormation(id, input); break
      case 'phaseWindow': this.props.setPhaseWindow(id, input); break
      case 'districtTownship': this.props.setDistrictTownship(id, input); break
      case 'lateralSite': this.props.setLateralSite(id, input); break
      case 'unitID': this.props.setUnitID(id, input); break
      case 'unit': this.props.setUnit(id, input); break
      default: throw Error('WellDataView is not configured to handle Cell input for Data Index ' + dataIndex)
    }
  }

  render() {
    let columns = [
      { name: 'Lateral ID', dataIndex: 'lateralID', dataType: 'number',  style: { width: '8rem' } },
      { name: 'GP Well No', dataIndex: 'gpWellNo', dataType: 'number', style: { width: '8rem' }, editable: true },
      { name: 'Well Name', dataIndex: 'wellName', dataType: 'string', style: { width: '20rem' } },
      { name: 'WI', dataIndex: 'workingInterest', dataType: 'number', style: { width: '8rem' }, editable: true },
      { name: 'Lateral Length', dataIndex: 'lateralLength', dataType: 'number', style: { width: '8rem' }, editable: true },
      { name: 'TVD', dataIndex: 'tvd', dataType: 'number', style: { width: '8rem' }, editable: true },
      { name: 'TMD', dataIndex: 'tmd', dataType: 'number', style: { width: '8rem' }, editable: true },
      { name: 'Spacing Left', dataIndex: 'spacingLeft', dataType: 'number', style: { width: '8rem' }, editable: true },
      { name: 'Spacing Right', dataIndex: 'spacingRight', dataType: 'number', style: { width: '8rem' }, editable: true },
      { name: 'Formation', dataIndex: 'formation', dataType: 'string', style: { width: '12rem' }, editable: true },
      { name: 'Phase Window', dataIndex: 'phaseWindow', dataType: 'string', style: { width: '16rem' }, editable: true },
      this.props.stateCode === 'OH' ? { name: 'District Township', dataIndex: 'districtTownship', dataType: 'string', style: { width: '12rem' }, editable: true } : undefined,
      this.props.stateCode === 'OH' ? { name: 'Lateral Site', dataIndex: 'lateralSite', dataType: 'string', style: { width: '8rem' }, editable: true } : undefined,
      this.props.stateCode === 'OH' ? { name: 'Unit ID', dataIndex: 'unitID', dataType: 'string', style: { width: '12rem' }, editable: true } : undefined,
      this.props.stateCode === 'OH' ? { name: 'Unit', dataIndex: 'unit', dataType: 'string', style: { width: '12rem' }, editable: true } : undefined,
    ].filter(Boolean)

    let data = this.props.wells.map(w => ({
      id: w.wellID,
      lateralID: w.lateralID,
      gpWellNo: w.gpWellNo,
      wellName: w.wellName,
      workingInterest: _Number.toFixed(w.workingInterest),
      lateralLength: w.lateralLength,
      tvd: w.tvd,
      tmd: w.tmd,
      spacingLeft: w.spacingLeft,
      spacingRight: w.spacingRight,
      phaseWindow: w.phaseWindow,
      formation: w.formation,
      districtTownship: w.districtTownship,
      lateralSite: w.lateralSite,
      unitID: w.unitID,
      unit: w.unit,
    }))
    return (
      <DragDropArea>
        <Table tableId='pad' columns={columns} data={data} settings={settings} onCellInput={this.handleCellInput} rowHeight={26}/>
      </DragDropArea>
    )
  }
}

const mapStateToProps = (state: StoreState) => ({
  stateCode: state.selectedStateCode,
  wells: Object.values(state.wells)
})

const mapDispatchToProps = dispatch => ({
  setGPWellNo: mapActionToProp(setGPWellNo, dispatch),
  setWellWI: mapActionToProp(setWellWI, dispatch),
  setLateralLength: mapActionToProp(setLateralLength, dispatch),
  setTVD: mapActionToProp(setTVD, dispatch),
  setTMD: mapActionToProp(setTMD, dispatch),
  setSpacingLeft: mapActionToProp(setSpacingLeft, dispatch),
  setSpacingRight: mapActionToProp(setSpacingRight, dispatch),
  setFormation: mapActionToProp(setFormation, dispatch),
  setPhaseWindow: mapActionToProp(setPhaseWindow, dispatch),
  setDistrictTownship: mapActionToProp(setDistrictTownship, dispatch),
  setLateralSite: mapActionToProp(setLateralSite, dispatch),
  setUnitID: mapActionToProp(setUnitID, dispatch),
  setUnit: mapActionToProp(setUnit, dispatch),
})

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(RawDataView)

const settings = {
  tierColors: [
    { color: 'black', backgroundColor: 'white' }  
  ]
}