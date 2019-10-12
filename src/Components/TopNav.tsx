import React from 'react'
import { DropdownButton, Dropdown, FormProps, FormControlProps } from 'react-bootstrap'
import { OpsSchedule, DisplayMode } from '../types'
import { SingleScreenSVG, SplitScreenVertSVG, SplitScreenHorzSVG } from './SVGs'
import { Form } from 'react-bootstrap';
import { isNumber } from 'data-type-ext/_Number'
const logo = require('../resources/gulfport_logo.png')

interface Props {
  stateCode: string
  opsScheduleID: number
  opsSchedules: OpsSchedule[]
  displayMode: DisplayMode
  onStateCodeChange: (stateCode: string) => void
  onOpsScheduleChange: (opsScheduleID: number) => void
  onDisplayModeChange: (displayMode: DisplayMode) => void
}
const TopNav: React.FC<Props> = ({ stateCode, opsScheduleID, opsSchedules, displayMode, onStateCodeChange, onOpsScheduleChange, onDisplayModeChange }) => {

  const handleChange = (e: React.FormEvent<FormProps & FormControlProps>) => {
    let { id, value } = e.currentTarget
    switch (id) {
      case 'state':
        onStateCodeChange(value)
        break
      case 'ops-schedule':
        onOpsScheduleChange(+value)
        break
    }
  }
  
  return (
    <div className="topnav fb-row-nowrap">
      <img src={logo} width='100'/>
      <div style={{ flex: '0 0 auto' }}>
        <Form.Control id='state' style={{ backgroundColor: 'transparent', color: 'var(--secondary-color', borderColor: 'var(--secondary-color)' }} as='select' onChange={handleChange} value={stateCode}>
          <option style={{color: 'black'}}>OH</option>
          <option style={{color: 'black'}}>OK</option>
        </Form.Control>
      </div>
      <div style={{ flex: '0 0 auto' }}>
        <Form.Control id='ops-schedule' style={{ backgroundColor: 'transparent', color: 'var(--secondary-color', borderColor: 'var(--secondary-color)' }} as='select' onChange={handleChange} value={!isNumber(opsScheduleID) ? 'Select Ops Schedule' : ''+opsScheduleID}>
          {!isNumber(opsScheduleID) ? <option style={{color: 'black'}}>Select Ops Schedule</option> : undefined}
          {opsSchedules.map(os => <option key={os.opsScheduleID} style={{color: 'black'}} value={os.opsScheduleID}>{os.opsScheduleName}</option>)}
          <option value={-1} style={{color: 'black', fontStyle: 'italic'}}>+ New Schedule</option>
        </Form.Control>
      </div>
      <div style={{ flex: '1 1 auto' }}/>
      <div style={{ flex: '0 0 auto' }}>
        <DropdownButton
          id='display-mode'
          title={displayMode === 'single' ? <SingleScreenSVG width={24} height={24}/>
              : displayMode === 'splitVert' ? <SplitScreenVertSVG width={24} height={24}/>
              : displayMode === 'splitHorz' ? <SplitScreenHorzSVG width={24} height={24}/>
              : ''}
          onSelect={onDisplayModeChange}
        >
          <Dropdown.Item eventKey='single'><SingleScreenSVG width={24} height={24}/></Dropdown.Item>
          <Dropdown.Item eventKey='splitVert'><SplitScreenVertSVG width={24} height={24}/></Dropdown.Item>
          <Dropdown.Item eventKey='splitHorz'><SplitScreenHorzSVG width={24} height={24}/></Dropdown.Item>
        </DropdownButton>
      </div>
    </div>
  )
}

export default TopNav