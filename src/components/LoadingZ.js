import React, { Component, PropTypes } from 'react'

class LoadingZ extends Component {
  constructor (props) {
    super(props)
    this.state = {
      delayed: false
    }
  }

  componentWillMount () {
    const delayed = this.props.delay > 0

    if (delayed) {
      this.setState({delayed: true})
      this._timeout = setTimeout(() => {
        this.setState({ delayed: false })
      }, this.props.delay)
    }
  }

  componentWillUnmount () {
    this._timeout && clearTimeout(this._timeout)
  }

  render () {
    const svg = require('assets/LoadingBars.svg')
    const style = {
      fill: this.props.color,
      height: this.props.height,
      width: this.props.width,
      margin: this.props.margin
    }
    return (
      <div
        style={style}
        dangerouslySetInnerHTML={{__html: svg}}
      />
    )
  }
}

LoadingZ.propTypes = {
  color: PropTypes.string,
  delay: PropTypes.number,
  margin: PropTypes.string,
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  type: PropTypes.string,
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
}

LoadingZ.defaultProps = {
  color: '#000',
  delay: 3000,
  height: 64,
  width: 64,
  margin: '0 auto'
}

export default LoadingZ
