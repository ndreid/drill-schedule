import React, { Component } from 'react'

interface Props {
  id: any
  selected?: boolean
  hidden?: boolean
  toggleSelected?: Function
}

class MultiselectDropdownItem extends Component<Props> {
  static defaultProps = {
    selected: false,
    hidden: false
  }
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }
  isUpdatingFromProps = false

  handleClick(e) {
    e.nativeEvent.stopImmediatePropagation()
    if (typeof this.props.toggleSelected === 'function')
      this.props.toggleSelected(this.props.id, !this.props.selected)
  }

  render() {
    let classNames = 'dd-item' + (this.props.selected ?' selected' : '')
    return (
      <div className={classNames} onClick={this.handleClick} hidden={this.props.hidden}>
        {this.props.children}
      </div>
    )
  }
}

export default MultiselectDropdownItem