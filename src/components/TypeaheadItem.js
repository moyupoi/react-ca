import React, { Component } from 'react'
import { Link } from 'react-router'

import styles from 'assets/Home.scss'

class TypeaheadItem extends Component {

  render () {
    const { options, setHistories } = this.props
    var itemList = options.map((item, i) => {
      if (item.placeable_type === 'landmark') {
        return (
          <li className={styles.destinationListItem} key={i} >
            <Link to={{'pathname': `/${item.offer_destination.slug}`, 'search': `?landmark_id=${item.placeable_id}`, state: {source: '首页&搜索', category: '首页&搜索'}}} onClick={setHistories.bind(this, item.name, item.offer_destination.slug, item.placeable_id)}>{item.name},{item.offer_destination.name},{item.country.name}</Link>
          </li>
        )
      } else if (item.placeable_type === 'offer_destination') {
        return (
          <li className={styles.destinationListItem} key={i} >
            <Link to={{'pathname': `/${item.slug}`, state: {source: '首页&搜索', category: '首页&搜索'}}} onClick={setHistories.bind(this, item.name, item.slug, '')}>{item.name},{item.country.name}</Link>
          </li>
        )
      } else {
        return (
          <li className={styles.destinationListItem} key={i} >
            <Link to={{'pathname': `/${item.slug}`, state: {source: '首页&搜索', category: '首页&搜索'}}} onClick={setHistories.bind(this, item.name, item.slug, '')}>{item.name}</Link>
          </li>
        )
      }
    })
    return (
        <div className={styles.destinationListContainer} style={{ display: this.props.listShow }}>
          <ul>
            {itemList}
          </ul>
        </div>
    )
  }
}

TypeaheadItem.propTypes = {
  options: React.PropTypes.array.isRequired,
  setHistories: React.PropTypes.func.isRequired,
  listShow: React.PropTypes.string.isRequired
}

export default TypeaheadItem
