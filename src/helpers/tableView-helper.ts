import padHelper from './pad-helper'
import { _Date, _Number, _G } from 'data-type-ext'
import { ScheduleType, Pad } from "../types";

const tableViewHelper = {
  [ScheduleType.Construction]: {
    columns: [
      {
        name: 'Pad Name', dataIndex: 'name', dataType: 'string',
        style: { width: '20rem' },
      },
      {
        name: '# Wells', dataIndex: 'wellCount', dataType: 'int',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Pad Construction Start', dataIndex: 'start', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Pad Construction End', dataIndex: 'end', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Duration', dataIndex: 'duration', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Default Pad Construction Start', dataIndex: 'defaultStart', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Default Duration', dataIndex: 'defaultDuration', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Manual Pad Construction Start', dataIndex: 'manualStart', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Manual Duration', dataIndex: 'manualDuration', dataType: 'number', editable: true,
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Cost', dataIndex: 'cost', dataType: 'number', format: 'number',
        style: { width: '10rem', align: 'right', },
      },
    ],
    crewData: (crewID: number, crewName: string, crewStart: string, crewEnd: string) => ({
      id: crewID,
      name: crewName,
      start: _Date.format(crewStart),
      end: _Date.format(crewEnd),
      settings: { draggable: false, },
      cellProps: [
        { dataIndex: 'manualStart', editable: false, },
        { dataIndex: 'manualDuration', editable: false, },
      ]
    }),
    padData: (pad: Pad) => ({
      id: pad.padID,
      name: pad.padName,
      wellCount: pad.wellCount,
      start: _Date.format(pad.constructionStart),
      end: _Date.format(pad.constructionEnd),
      duration: _Number.toFixed(pad.constructionDuration, 0),
      defaultStart: _Date.format(pad.constructionStartDefault),
      defaultDuration: _Number.toFixed(pad.constructionDurationDefault, 0),
      manualStart: _Date.format(pad.manualDates[ScheduleType.Construction]),
      manualDuration: _Number.toFixed(pad.manualDurations[ScheduleType.Construction], 0),
      cost: _Number.toCurrency(padHelper.getScheduleCost(pad, ScheduleType.Construction), 0),
      settings: { draggable: false, },
    })
  },
  [ScheduleType.Drill]: {
    columns: [
      {
        name: 'Pad Name', dataIndex: 'name', dataType: 'string',
        style: { width: '20rem', },
      },
      {
        name: '# Wells', dataIndex: 'wellCount', dataType: 'int',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Rig Spud', dataIndex: 'start', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Drilling End', dataIndex: 'end', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Duration', dataIndex: 'duration', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Delay', dataIndex: 'delay', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Default Rig Spud', dataIndex: 'defaultStart', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Default Duration', dataIndex: 'defaultDuration', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Manual Rig Spud', dataIndex: 'manualStart', dataType: 'date', editable: true,
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Manual Duration', dataIndex: 'manualDuration', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Manual Delay', dataIndex: 'manualDelay', dataType: 'number', editable: true,
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Cost', dataIndex: 'cost', dataType: 'number', format: 'number',
        style: { width: '10rem', align: 'right', },
      },
    ],
    crewData: (crewID: number, crewName: string, crewStart: string, crewEnd: string) => ({
      id: crewID,
      name: crewName,
      start: _Date.format(crewStart),
      end: _Date.format(crewEnd),
      settings: { draggable: false, },
      cellProps: [
        { dataIndex: 'manualDelay', editable: false, },
      ]
    }),
    padData: (pad: Pad, moveTime: number) => ({
      id: pad.padID,
      name: pad.padName,
      wellCount: pad.wellCount,
      start: _Date.format(pad.drillStart),
      end: _Date.format(pad.drillEnd),
      duration: _Number.toFixed(pad.drillDuration, 0),
      delay: _G.coalesce(pad.manualDelays[ScheduleType.Drill], moveTime),
      defaultStart: _Date.format(pad.drillStartDefault),
      defaultDuration: _Number.toFixed(pad.drillDurationDefault, 0),
      manualStart: _Date.format(pad.manualDates[ScheduleType.Drill]),
      manualDuration: _Number.toFixed(pad.manualDurations[ScheduleType.Drill], 0),
      manualDelay: pad.manualDelays[ScheduleType.Drill],
      cost: _Number.toCurrency(padHelper.getScheduleCost(pad, ScheduleType.Drill), 0),
    })
  },
  [ScheduleType.Frac]: {
    columns: [
      {
        name: 'Pad Name', dataIndex: 'name', dataType: 'string',
        style: {  width: '20rem', },
      },
      {
        name: '# Wells', dataIndex: 'wellCount', dataType: 'int',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Frac Start', dataIndex: 'start', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Frac End', dataIndex: 'end', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Duration', dataIndex: 'duration', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Delay', dataIndex: 'delay', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Default Frac Start', dataIndex: 'defaultStart', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Default Duration', dataIndex: 'defaultDuration', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Manual Frac Start', dataIndex: 'manualStart', dataType: 'date', editable: true,
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Manual Duration', dataIndex: 'manualDuration', dataType: 'number', editable: true,
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Manual Delay', dataIndex: 'manualDelay', dataType: 'number', editable: true,
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Cost', dataIndex: 'cost', dataType: 'number', format: 'number',
        style: { width: '10rem', align: 'right', },
      },
    ],
    crewData: (crewID: number, crewName: string, crewStart: string, crewEnd: string) => ({
      id: crewID,
      name: crewName,
      start: _Date.format(crewStart),
      end: _Date.format(crewEnd),
      settings: { draggable: false, },
      cellProps: [
        { dataIndex: 'manualStart', editable: false, },
        { dataIndex: 'manualDuration', editable: false, },
        { dataIndex: 'manualDelay', editable: false, },
      ]
    }),
    padData: (pad: Pad, moveTime: number) => ({
      id: pad.padID,
      name: pad.padName,
      wellCount: pad.wellCount,
      start: _Date.format(pad.fracStart),
      end: _Date.format(pad.fracEnd),
      duration: _Number.toFixed(pad.fracDuration, 0),
      delay: _G.coalesce(pad.manualDelays[ScheduleType.Frac], moveTime),
      defaultStart: _Date.format(pad.fracStartDefault),
      defaultDuration: _Number.toFixed(pad.fracDurationDefault, 0),
      manualStart: _Date.format(pad.manualDates[ScheduleType.Frac]),
      manualDuration: _Number.toFixed(pad.manualDurations[ScheduleType.Frac], 0),
      manualDelay: pad.manualDelays[ScheduleType.Frac],
      cost: _Number.toCurrency(padHelper.getScheduleCost(pad, ScheduleType.Frac), 0),
    })
  },
  [ScheduleType.DrillOut]: {
    columns: [
      {
        name: 'Pad Name', dataIndex: 'name', dataType: 'string',
        style: {  width: '20rem', },
      },
      {
        name: '# Wells', dataIndex: 'wellCount', dataType: 'int',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Drill Out Start', dataIndex: 'start', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Drill Out End', dataIndex: 'end', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Duration', dataIndex: 'duration', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Delay', dataIndex: 'delay', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Default Drill Out Start', dataIndex: 'defaultStart', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Default Duration', dataIndex: 'defaultDuration', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Manual Drill Out Start', dataIndex: 'manualStart', dataType: 'date', editable: true,
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Manual Duration', dataIndex: 'manualDuration', dataType: 'number', editable: true,
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Manual Delay', dataIndex: 'manualDelay', dataType: 'number', editable: true,
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Cost', dataIndex: 'cost', dataType: 'number', format: 'number',
        style: { width: '10rem', align: 'right', },
      },
    ],
    crewData: (crewID: number, crewName: string, crewStart: string, crewEnd: string) => ({
      id: crewID,
      name: crewName,
      start: _Date.format(crewStart),
      end: _Date.format(crewEnd),
      settings: { draggable: false, },
      cellProps: [
        { dataIndex: 'manualStart', editable: false, },
        { dataIndex: 'manualDuration', editable: false, },
        { dataIndex: 'manualDelay', editable: false, },
      ]
    }),
    padData: (pad: Pad, moveTime: number) => ({
      id: pad.padID,
      name: pad.padName,
      wellCount: pad.wellCount,
      start: _Date.format(pad.drillOutStart),
      end: _Date.format(pad.drillOutEnd),
      duration: _Number.toFixed(pad.drillOutDuration, 0),
      delay: _G.coalesce(pad.manualDelays[ScheduleType.DrillOut], moveTime),
      defaultStart: _Date.format(pad.drillOutStartDefault),
      defaultDuration: _Number.toFixed(pad.drillOutDurationDefault, 0),
      manualStart: _Date.format(pad.manualDates[ScheduleType.DrillOut]),
      manualDuration: _Number.toFixed(pad.manualDurations[ScheduleType.DrillOut], 0),
      manualDelay: pad.manualDelays[ScheduleType.DrillOut],
      cost: _Number.toCurrency(padHelper.getScheduleCost(pad, ScheduleType.DrillOut), 0),
    })
  },
  [ScheduleType.Facilities]: {
    columns: [
      {
        name: 'Pad Name', dataIndex: 'name', dataType: 'string',
        style: {  width: '20rem', },
      },
      {
        name: '# Wells', dataIndex: 'wellCount', dataType: 'int',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Facilities Start', dataIndex: 'start', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Facilities End', dataIndex: 'end', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Duration', dataIndex: 'duration', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Delay', dataIndex: 'delay', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Default Facilities Start', dataIndex: 'defaultStart', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Default Duration', dataIndex: 'defaultDuration', dataType: 'number',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Manual Facilities Start', dataIndex: 'manualStart', dataType: 'date', editable: true,
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'Manual Duration', dataIndex: 'manualDuration', dataType: 'number', editable: true,
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Manual Delay', dataIndex: 'manualDelay', dataType: 'number', editable: true,
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Cost', dataIndex: 'cost', dataType: 'number', format: 'number',
        style: { width: '10rem', align: 'right', },
      },
    ],
    crewData: (crewID: number, crewName: string, crewStart: string, crewEnd: string) => ({
      id: crewID,
      name: crewName,
      start: _Date.format(crewStart),
      end: _Date.format(crewEnd),
      settings: { draggable: false, },
      cellProps: [
        { dataIndex: 'manualStart', editable: false, },
        { dataIndex: 'manualDuration', editable: false, },
        { dataIndex: 'manualDelay', editable: false, },
      ]
    }),
    padData: (pad: Pad, moveTime: number) => ({
      id: pad.padID,
      name: pad.padName,
      wellCount: pad.wellCount,
      start: _Date.format(pad.facilitiesStart),
      end: _Date.format(pad.facilitiesEnd),
      duration: _Number.toFixed(pad.facilitiesDuration, 0),
      delay: _G.coalesce(pad.manualDelays[ScheduleType.Facilities], moveTime),
      defaultStart: _Date.format(pad.facilitiesStartDefault),
      defaultDuration: _Number.toFixed(pad.facilitiesDurationDefault, 0),
      manualStart: _Date.format(pad.manualDates[ScheduleType.Facilities]),
      manualDuration: _Number.toFixed(pad.manualDurations[ScheduleType.Facilities], 0),
      manualDelay: pad.manualDelays[ScheduleType.Facilities],
      cost: _Number.toCurrency(padHelper.getScheduleCost(pad, ScheduleType.Facilities), 0),
    })
  },
  [ScheduleType.Flowback]: {
    columns: [
      {
        name: 'Pad Name', dataIndex: 'name', dataType: 'string',
        style: {  width: '20rem', },
      },
      {
        name: '# Wells', dataIndex: 'wellCount', dataType: 'int',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'GPOR Ready for Production', dataIndex: 'readyForProd', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'TIL', dataIndex: 'til', dataType: 'date',
        style: { width: '10rem', align: 'center', },
      },
      {
        name: 'FirstFlow', dataIndex: 'firstFlow', dataType: 'date',
        style: { width: '6rem', align: 'center', },
      },
      {
        name: 'Cost', dataIndex: 'cost', dataType: 'number', format: 'number',
        style: { width: '10rem', align: 'right', },
      },
    ],
    crewData: (crewID: number, crewName: string) => ({
      id: crewID,
      name: crewName,
      settings: { draggable: false, },
      cellProps: [{ dataIndex: 'til', editable: false }]
    }),
    padData: (pad: Pad) => ({
      id: pad.padID,
      name: pad.padName,
      wellCount: pad.wellCount,
      readyForProd: _Date.format(pad.facilitiesEnd),
      til: _Date.format(pad.til),
      firstFlow: _Date.format(pad.firstFlow),
      cost: _Number.toCurrency(padHelper.getScheduleCost(pad, ScheduleType.Flowback), 0),
    })
  },
}

export default tableViewHelper