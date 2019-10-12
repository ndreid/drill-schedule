import React, { Component } from 'react'

interface Props {
 buttonNode: HTMLDivElement
 toggleMenu: Function
 show: boolean
}

class MultiselectDropdownMenu extends Component<Props> {
  constructor(props) {
    super(props)

    this.node = React.createRef()
  }
  node = React.createRef<HTMLDivElement>()

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  handleClick = (e) => {
    this.node.current
    if (this.props.show && !this.node.current.contains(e.target) && !this.props.buttonNode.contains(e.target)) {
      this.props.toggleMenu(e)
    }
  }

  render() {
    let style = {
      transform: `translate(0, ${this.props.buttonNode.clientHeight})`,
      display: !this.props.show ? 'none' : undefined
    }
    return (
      <div ref={this.node} className='dd-menu' style={style}>
        {this.props.children}
      </div>

    )
  }
}

export default MultiselectDropdownMenu