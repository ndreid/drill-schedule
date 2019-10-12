import React from 'react'
import './ErrorHandler.css'

interface State {
  error: Error,
  info: React.ErrorInfo,
}
class ErrorHandler extends React.Component<{}, State> {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      info: null,
    }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({
      error,
      info
    })
  }

  render() {
    if (this.state.error) {
      return (
        <div className='error-container'>
          <h1 className='error-header'>
            ERROR
          </h1>
          <div className='error-details'>
            <p><b>Name:</b> {this.state.error.name}</p>
            <p><b>Message:</b> {this.state.error.message}</p>
            <details>
              <summary><b>Error Stack</b></summary>
                <span>{this.state.error.stack}</span>
            </details>
            <br></br>
            <details>
              <summary><b>Component Stack</b></summary>
                <span>{this.state.info.componentStack}</span>
            </details>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorHandler