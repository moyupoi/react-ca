import React, { Component, PropTypes } from 'react'
import styles from '../assets/Star.scss'

class Star extends Component {
  render () {
    const { num } = this.props
    let s = styles.star0
    switch(num) {
      case 0:
        s = styles.star0
        break
      case 1:
        s = styles.star1
        break
      case 2:
        s = styles.star2
        break
      case 3:
        s = styles.star3
        break
      case 4:
        s = styles.star4
        break
      case 5:
        s = styles.star5
        break
      default:
        s = styles.star0
        break
    }
    return (
      <div className={styles.star}>
        <i className={s}></i>
      </div>
    )
  }
}
export default Star
