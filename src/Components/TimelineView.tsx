import 'vis/dist/vis.css'
import './TimelineView.css'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as vis from 'vis'
import padHelper from '../helpers/pad-helper'
import { Thunk, mapActionToProp } from '../redux/middleware/batched-thunk'
import { movePad } from '../redux/actions/pad-actions'
import { _Date } from 'data-type-ext'
import { ScheduleType, StoreState, Pads, Wells, Pad } from '../types';

interface OwnProps {
  scheduleType: ScheduleType
}
interface StateProps {
  pads: Pads
  wells: Wells
  crews: Record<number, string>
}
interface DispatchProps {
  movePad: Thunk<typeof movePad>
}
interface State {
  // timeline: any
}
type Props = StateProps & DispatchProps & OwnProps

class TimelineView extends Component<Props, State> {
  constructor(props) {
    super(props)

    // this.state = {
    //   timeline: {}
    // }
  }
  private timelineRef = React.createRef<HTMLDivElement>()
  private timeline: vis.Timeline = undefined
  private timelineOptions: vis.TimelineOptions = undefined
  private timelineRange = { start: _Date.toString(new Date()), end: _Date.addYears(new Date(), 1) }
  private isRefreshing = true

  componentDidMount() {
    this.initializeTimeline()
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.scheduleType !== prevProps.scheduleType) {
      this.timelineOptions.editable = {
        updateGroup: (this.props.scheduleType === ScheduleType.Lateral || this.props.scheduleType === ScheduleType.Flowback) ? false : true,
        updateTime: (this.props.scheduleType === ScheduleType.Lateral || this.props.scheduleType === ScheduleType.Flowback) ? false : true,
      }
      this.timeline.setOptions(this.timelineOptions)
      this.forceUpdate()
    }
  }

  initializeTimeline() {
    this.timelineOptions = {
      groupOrder: 'content',
      margin: {
        item: {
          horizontal: -1
        }
      },
      orientation: 'top',
      selectable: true,
      verticalScroll: true,
      // zoomKey: 'ctrlKey',
      // editable: {
      //   updateGroup: false,
      //   updateTime: false,
      // },
      editable: false,
      zoomMin: 604800000,
      zoomMax: 157680000000,
      tooltip: {
        followMouse: true,
        overflowMethod: 'flip'
      },
      width: '100%',
      maxHeight: '100%',
      start: this.timelineRange.start,
      end: this.timelineRange.end,
      onMove: (item, callback) => {
        var crewID = item.group === 0 ? undefined : item.group

        var movedPadStart = new Date(item.start)
        var prevPads: any = [ ...Object.values(this.props.pads) ].filter((p: any) => {
          return p.crews[this.props.scheduleType] == crewID && _Date.isAfter(movedPadStart, padHelper.getScheduleStartDate(p, this.props.scheduleType))  // eslint-disable-line
        }).sort((left, right) => _Date.diff(padHelper.getScheduleStartDate(right, this.props.scheduleType), padHelper.getScheduleStartDate(left, this.props.scheduleType)))


        var targetPadID
        if (prevPads.length > 0) {
          targetPadID = prevPads[0].padID
          if (targetPadID === this.props.pads[item.id].predecessors[this.props.scheduleType]) {
            targetPadID = item.id
          }
        }
        
        this.isRefreshing = true
        this.props.movePad(this.props.scheduleType, +item.id, targetPadID, +crewID)
      }
      // min: '5/1/2018', //moment(this.dateFrom).format("MM/DD/YYYY"),
      // max: '5/1/2019' //moment(this.dateTo).format("MM/DD/YYYY")
    }
    var groups = new vis.DataSet(this.getGroups())
    var items = new vis.DataSet(this.getItems())

    this.timeline = new vis.Timeline(this.timelineRef.current, items, groups, this.timelineOptions)
    // this.setState({ timeline: new vis.Timeline(this.refs.visTimeline, items, groups, this.timelineOptions) }, () => {
    //   this.isRefreshing = false;
    // })
    this.forceUpdate()
  }

  refreshTimeline() {
    this.isRefreshing = true
    var groups = new vis.DataSet(this.getGroups())
    var items = new vis.DataSet(this.getItems())
    
    this.timeline.setGroups(groups)
    this.timeline.setItems(items)

    // this.setState({ timeline: this.state.timeline }, () => {
    //   this.isRefreshing = false;
    // })
  }

  getGroups() {
    var groups = []
    if (this.props.scheduleType === ScheduleType.Lateral) {
      for (let pad of Object.values(this.props.pads)) {
        groups.push({ id: pad.padID, content: pad.padName })
      }
    } else {
      for (let [crewID, crewName] of Object.entries(this.props.crews[this.props.scheduleType])) {
        groups.push({ id: crewID, content: crewName })
      }
    }

    groups.push({ id: 0, content: 'unassigned' })
    return groups
  }

  getItems() {
    var items = []
    for (let pad of Object.values(this.props.pads)) {
      let item: any = this.getItem(pad)
      if (item.start) {
        items.push(item)
      }
    }
    
    return items
  }

  getGroupID(pad: Pad) {
    return this.props.scheduleType === ScheduleType.Lateral ? pad.padID
      : pad.crews.hasOwnProperty(this.props.scheduleType) ? pad.crews[this.props.scheduleType]
      : 0
  }

  getItem(pad: Pad) {
    var timelineGroupID = this.getGroupID(pad)
    switch (this.props.scheduleType) {
      case ScheduleType.Lateral: return [{ id: pad.padID + '-drilling', content: this.getItemContent(pad), start: pad.drillStart, end: pad.drillEnd, group: timelineGroupID, className: 'vis-blue' }
                                    ,{ id: pad.padID + '-frac', content: this.getItemContent(pad), start: pad.fracStart, end: pad.fracEnd, group: timelineGroupID, className: 'vis-blue' }
                                    ,{ id: pad.padID + '-drillout', content: this.getItemContent(pad), start: pad.drillOutStart, end: pad.drillOutEnd, group: timelineGroupID, className: 'vis-blue' }
                                    ,{ id: pad.padID + '-facilities', content: this.getItemContent(pad), start: pad.facilitiesStart, end: pad.facilitiesEnd, group: timelineGroupID, className: 'vis-blue' }
                                    ,{ id: pad.padID + '-flowback', content: this.getItemContent(pad), start: pad.firstFlow, group: timelineGroupID, className: 'vis-blue' }]
      case ScheduleType.Construction:
      case ScheduleType.Drill:
      case ScheduleType.Frac:
      case ScheduleType.DrillOut:
      case ScheduleType.Facilities:
        return {
          id: pad.padID,
          content: this.getItemContent(pad),
          start: padHelper.getScheduleStartDate(pad, this.props.scheduleType),
          end: padHelper.getScheduleEndDate(pad, this.props.scheduleType),
          group: timelineGroupID,
          className: 'vis-blue',
        }

      case ScheduleType.Flowback:
        return {
          id: pad.padID,
          content: this.getItemContent(pad),
          start: pad.firstFlow,
          group: timelineGroupID, className: 'vis-blue' }
      default: throw new Error("getTimelineItem() is not configured to handle ScheduleType '" + this.props.scheduleType + "'.")
    }
  }

  getItemContent(pad: Pad) {
    return this.getItemContentTitle(pad.padName)
  }

  getItemContentTitle(title: string) {
    return '<div style="font-size: 12px"><b>' + title + '</b></div>'
  }

  render() {
    if (this.timeline) {
      this.refreshTimeline()
    }
    return (
      <div ref={this.timelineRef} style={{height:'100%', width:'100%'}}></div>
    )
  }
}

const mapStateToProps = (state: StoreState) => ({
  pads: state.pads,
  wells: state.wells,
  crews: state.crews
})

const mapDispatchToProps = dispatch => ({
  movePad: mapActionToProp(movePad, dispatch)
})

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(TimelineView);
