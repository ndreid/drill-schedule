import React from 'react'
import { TimelineSVG, TableSVG, SummarySVG, MetricsSVG, AfeSVG, CrewSVG, DatabaseSVG, SettingsSVG, UpSVG, DownSVG } from './SVGs'
import { ViewType } from '../types';
import { faFileExcel } from '@fortawesome/free-regular-svg-icons';

interface Props {
  selectedView: ViewType,
  selectView: (viewName: ViewType) => void
}
interface State {
  isScrollable: boolean
  canScrollUp: boolean
  canScrollDown: boolean
}

class LeftNav extends React.Component<Props, State> {
  // constructor(props) {
  //   super(props)

  //   this.state = {
  //     isScrollable: false,
  //     canScrollUp: false,
  //     canScrollDown: false,
  //   }

  //   this.checkScrollables = this.checkScrollables.bind(this)
  // }
  // ref = React.createRef<HTMLDivElement>()

  // componentDidMount() {
  //   this.checkScrollables()
  // }

  // componentDidUpdate() {
  //   this.checkScrollables()
  // }

  // checkScrollables() {
  //   let elem = this.ref.current
  //   let isScrollable = elem.scrollHeight > elem.clientHeight
  //   let canScrollUp = isScrollable && elem.scrollHeight - Math.ceil(elem.scrollTop) === elem.clientHeight
  //   let canScrollDown = isScrollable && elem.scrollTop === 0

  //   if (isScrollable !== this.state.isScrollable || canScrollUp !== this.state.canScrollUp || canScrollDown !== this.state.canScrollDown)
  //     this.setState({ isScrollable, canScrollUp, canScrollDown })
  // }

  render() {
    return (
      <div className='leftnav'>
        {/* {this.state.canScrollUp ? <UpSVG/> : null} */}
        {/* <UpSVG/> */}
        {/* <div className='leftnav'> */}
          <a className={'nav-icon fi-static' + (this.props.selectedView === ViewType.Timeline ? ' selected' : '')} onClick={() => this.props.selectView(ViewType.Timeline)}><TimelineSVG /></a>
          <a className={'nav-icon fi-static' + (this.props.selectedView === ViewType.Table ? ' selected' : '')} onClick={() => this.props.selectView(ViewType.Table)}><TableSVG /></a>
          <a className={'nav-icon fi-static' + (this.props.selectedView === ViewType.Summary ? ' selected' : '')} onClick={() => this.props.selectView(ViewType.Summary)}><SummarySVG /></a>
          <a className={'nav-icon fi-static' + (this.props.selectedView === ViewType.Metrics ? ' selected' : '')} onClick={() => this.props.selectView(ViewType.Metrics)}><MetricsSVG /></a>
          <a className={'nav-icon fi-static' + (this.props.selectedView === ViewType.AFE ? ' selected' : '')} onClick={() => this.props.selectView(ViewType.AFE)}><AfeSVG /></a>
          <a className={'nav-icon fi-static' + (this.props.selectedView === ViewType.Crew ? ' selected' : '')} onClick={() => this.props.selectView(ViewType.Crew)}><CrewSVG /></a>
          <a className={'nav-icon fi-grow' + (this.props.selectedView === ViewType.SourceData ? ' selected' : '')} onClick={() => this.props.selectView(ViewType.SourceData)}><DatabaseSVG /></a>
          <a className={'nav-icon fi-static last' + (this.props.selectedView === ViewType.Settings ? ' selected' : '')} onClick={() => this.props.selectView(ViewType.Settings)}><SettingsSVG /></a>
        {/* </div> */}
        {/* {this.state.canScrollDown ? <DownSVG/> : null} */}
        {/* <DownSVG/> */}
      </div>
    )
  }
}

export default LeftNav