import React, { Component } from 'react'
import './MultiselectDropdown.css'
import MultiselectDropdownMenu from './MultiselectDropdownMenu'
import MultiselectDropdownItem from './MultiselectDropdownItem'
// namespace MultiselectDropdown {
  
interface Props {
  title: string
  color?: string
  backgroundColor?: string
  onSelectionChange?: Function
}
interface State {
  showMenu: boolean
  selectedItems : any[]
}
class MultiselectDropdown extends Component<Props, State> {
  public static Item = MultiselectDropdownItem
  static defaultProps = {
    color: 'white',
    backgroundColor: 'gray'
  }
  constructor(props) {
    super(props)
    
    let selectedItems = React.Children.toArray(props.children).reduce((items, child) => {
      if (child.props.selected)
        items.push(child.props.id)
      return items
    }, [])

    this.state = {
      showMenu: false,
      selectedItems,
    }

    this.toggleMenu = this.toggleMenu.bind(this)
    this.toggleSelectedItem = this.toggleSelectedItem.bind(this)
  }
  buttonNode = React.createRef<HTMLDivElement>()

  isTogglingMenu = false

  showMenu() {
    this.setState({ showMenu: true })
  }

  hideMenu() {
    this.setState({ showMenu: false })
  }

  toggleMenu() {
    this.setState(state => ({ showMenu: !state.showMenu }))
  }

  toggleSelectedItem(id, selected) {
    if (this.props.onSelectionChange) {
      let list = React.Children.toArray(this.props.children).reduce((items, child) => {
        //@ts-ignore
        //@ts-ignore
        if ((child.props.id != id && child.props.selected) || (child.props.id == id && selected)) {
          //@ts-ignore
          items.push(child.props.id)
        }
        return items
      },[])

      this.props.onSelectionChange(list)
    }
    // this.setState(state => ({
    //   selectedItems: state.selectedItems.includes(id)
    //     ? state.selectedItems.filter(i => i !== id)
    //     : [...state.selectedItems, id]
    // }), this.onSelectionChange) 
  }

  onSelectionChange() {
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(this.state.selectedItems)
    }
  }

  componentDidMount() {
    this.forceUpdate()
  }

  render() {
    let children = React.Children.map(this.props.children, child => (
      // @ts-ignore
      React.cloneElement(child, {
        toggleSelected: this.toggleSelectedItem
      })
    ))
    let style = {
      color: this.props.color,
      backgroundColor: this.props.backgroundColor,
    }

    return (
      <div className='dd-dropdown'>
        <div ref={this.buttonNode} className='dd-button' onClick={this.toggleMenu} style={style}>{this.props.title}</div>
        {
          this.buttonNode.current
            ? <MultiselectDropdownMenu
                buttonNode={this.buttonNode.current}
                toggleMenu={this.toggleMenu}
                show={this.state.showMenu}
              >
                {children}
              </MultiselectDropdownMenu>  
            : undefined
        }  
      </div>
    )
  }
}

export default MultiselectDropdown