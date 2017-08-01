import React, { Component } from 'react'
import { Link } from 'react-router'
import cookie from 'react-cookie'
import Scroll from 'react-scroll'
var LinkScroll = Scroll.Link
var Element = Scroll.Element
var _ = require('underscore')
import { isEmpty, flatten, sortBy, last, first } from 'lodash/fp'
import { saSearch, saSearchSelect } from 'tools/sensors'

import TypeaheadItem from 'components/TypeaheadItem'
import styles from 'assets/Home.scss'

class SearchDestination extends Component {
  constructor (props) {
    super(props)
    this.clearSearchInput = this.clearSearchInput.bind(this)
    this.setHistories = this.setHistories.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.setHotCities = this.setHotCities.bind(this)
    this.buryPointSearch = this.buryPointSearch.bind(this)
    this.cityListClick = this.cityListClick.bind(this)
    this.recommendClick = this.recommendClick.bind(this)
    this.wordClick = this.wordClick.bind(this)
    this.historyClick = this.historyClick.bind(this)

    this.state = {
      iconShow: 'none',
      SearchDestinationList: 'none',
      destinationValue: ''
    }
  }

  handleChange (e) {
    if (e.target.value.length > 0) {
      this.setState({ iconShow: 'block', SearchDestinationList: 'block', destinationValue: e.target.value })
      this.props.fetchSearchDestination(e.target.value)
    } else {
      this.setState({ iconShow: 'none', SearchDestinationList: 'none', destinationValue: e.target.value })
    }
  }

  clearSearchInput (e) {
    this.setState({destinationValue: ''})
    this.setState({ iconShow: 'none', SearchDestinationList: 'none' })
  }

  toCities (data) {
    var itemsHash = []
    data.map((item) => {
      itemsHash.push(item.cities)
    })
    itemsHash = _.flatten(itemsHash)
    return itemsHash
  }

  toSortCities (data) {
    var obj = {}
    for (var i = 0; i < 26; i++) {
      var arr = []
      data.map((item) => {
        if (item.flopy === String.fromCharCode(65 + i)) {
          obj[String.fromCharCode(65 + i)] = []
          arr.push(item)
          obj[String.fromCharCode(65 + i)].push(arr)
          obj[String.fromCharCode(65 + i)] = _.flatten(obj[String.fromCharCode(65 + i)])
        }
      })
    }
    return obj
  }

  // 埋点--search联想词输入、城市列表以及历史记录的独立用户数和次数
  buryPointSearch (name, value_name, value_id) {
    let pathName = window.location.pathname
    if (pathName === '/') {
      saSearchSelect('首页', name, value_name, value_id)
    } else if ((/^\/lands/.test(pathName)) && (/^\/lands\/[^\/]*$/.test(pathName))) {
      saSearchSelect(this.props.landsName, name, value_name, value_id)
    }
  }

  // 点击城市列表,热门推荐,提示词,历史记录
  setHistories (nameVal, nameEn, landmarkId) {
    var histories = []
    var item = {}
    if (cookie.load('histories')) {
      histories = cookie.load('histories')
    }
    if (histories.length > 0) {
      histories.map((item, i) => {
        if (item.e === nameEn) {
          histories.splice(i, 1)
        }
      })
    }
    item = {
      'n': nameVal,
      'e': nameEn,
      'id': landmarkId
    }
    histories.unshift(item)
    cookie.save('histories', histories, { maxAge: 3600 * 24 * 30})
  }

  // 点击城市列表
  cityListClick (nameVal, nameEn) {
    this.setHistories(nameVal, nameEn)
    this.buryPointSearch('城市列表', nameVal, nameEn)
  }
  // 点击热门推荐
  recommendClick (nameVal, nameEn) {
    this.setHistories(nameVal, nameEn)
    this.buryPointSearch('热门推荐', nameVal, nameEn)
  }
  // 点击联想词
  wordClick (nameVal, nameEn) {
    this.setHistories(nameVal, nameEn)
    this.buryPointSearch('联想词输入', nameVal, nameEn)
  }
  // 点击历史记录
  historyClick (nameVal, nameEn) {
    this.setHistories(nameVal, nameEn)
    this.buryPointSearch('历史记录', nameVal, nameEn)
  }

  setHotCities (data) {
    let arr = []
    data.map((item) => {
      arr.push(item.country)
      item.cities.map((cityItem) => {
        arr.push(cityItem)
      })
    })
    arr = _.sortBy(arr, 'suggest')
    arr = _.last(arr, 11)
    return arr
  }

  render () {
    const { destinations, destinationCities, category } = this.props
    const { values } = destinations
    const { results } = values
    const { items } = destinationCities

    // 搜索标识来源
    let pathname = window.location.pathname
    var queryS = ''
    if (pathname === '/') { // 首页
      var queryS = '?s=sysearch'
    }

    let typeaheadArr
    if (this.props.destinations.values.meta) {
      if (this.props.destinations.values.meta.q === this.state.destinationValue) {
        typeaheadArr = results
      }
    }
    if (cookie.load('histories')) {
      var historyItems = _.first(cookie.load('histories'), 5)
    }
    if (items.length > 0) {
      var hotCities = this.setHotCities(items)
      var cityList = this.toCities(items)
      var citySortList = this.toSortCities(cityList)
      var arr = []
      for (let i = 0; i < 26; i++) {
        arr.push(i)
      }
      var cityListHtml = arr.map((i) =>
        <Element key={i} name={'list' + i}>
          <div className={styles.cityListItemHeader}>
            <a href='#' className={styles.cityListItemHeaderItem}>{String.fromCharCode(65 + i)}</a>
          </div>
          <div className={styles.cityListItemContainer}>
            {!isEmpty(items) && !isEmpty(citySortList[String.fromCharCode(65 + i)]) &&
              citySortList[String.fromCharCode(65 + i)].map((item, i) =>
                <Link to={{pathname: `/${item.uid}`, search: queryS, state: {source: '首页&搜索', category: '首页&搜索', place: items.name}}} className={styles.cityItem} key={i} onClick={this.cityListClick.bind(this, item.zh, item.uid)} >{item.zh}</Link>
            )}
          </div>
        </Element>
      )
      var cityListNav = arr.map((i) =>
        { if (isEmpty(citySortList[String.fromCharCode(65 + i)])) {
          return (
            <LinkScroll to={'list' + i} className={styles.cityListNavItemInvalid} key={i} spy smooth duration={500}>{String.fromCharCode(65 + i)}</LinkScroll>
          )
        } else {
          return (
            <LinkScroll to={'list' + i} className={styles.cityListNavItem} key={i} spy smooth duration={500}>{String.fromCharCode(65 + i)}</LinkScroll>
          )
        }
      })
      var hotCitiesList = hotCities.map((item, i) =>
      {
        return (
          <Link to={{pathname: `/${item.uid}`, search: queryS, state: {source: '首页&搜索', category: '首页&搜索', place: items.name}}} className={styles.recommondItem} onClick={this.recommendClick.bind(this, item.zh, item.uid)} key={i}>{item.zh}</Link>
        )
      })
    }

    return (
      <div className={styles.searchHomeContainer} style={{display: this.props.isShow }}>
        <div className={styles.searchBox}>
          <div className={styles.searchBoxInput}>
            <input type='text' placeholder='输入你的目的地' value={this.state.destinationValue} onChange={this.handleChange} />
            <span className={styles.focusClose} style={{display: this.state.iconShow}} onClick={this.clearSearchInput}></span>
          </div>
          <div className={styles.cancel} onClick={this.props.searchDesHide} >取消</div>
        </div>
        {!isEmpty(typeaheadArr) &&
          <TypeaheadItem setHistories={this.wordClick} options={typeaheadArr} listShow={this.state.SearchDestinationList} />
        }
        {!isEmpty(historyItems) &&
          <div className={styles.history}>
            {historyItems.map((item, i) => {
              if (item.id) {
                return (
                  <Link to={{'pathname': `/${item.e}`, 'search': `#{queryS}&landmark_id=${item.id}`, state: {source: '首页&搜索', category: '首页&搜索', place: items.name}}} className={styles.historyItem} onClick={this.historyClick.bind(this, item.n, item.e)} key={i}>{item.n}</Link>
                )
              } else {
                return (
                  <Link to={{'pathname': `/${item.e}`, 'search': queryS, state: {source: '首页&搜索', category: '首页&搜索', place: items.name}}} className={styles.historyItem} onClick={this.historyClick.bind(this, item.n, item.e)} key={i}>{item.n}</Link>
                )
              }
            }
          )}
          </div>
        }
        <div className={styles.recommond}>
          <h3 className={styles.recommondHeader}>热门推荐</h3>
          <div className={styles.recommondContainer}>
            {hotCitiesList}
          </div>
        </div>
        <div className={styles.cityList}>
          <div className={styles.cityListHeader}>城市列表</div>
          <div className={styles.cityListNav}>
            {cityListNav}
          </div>
          {!isEmpty(items) &&
            cityListHtml
          }
        </div>
      </div>
    )
  }
}

SearchDestination.propTypes = {
  destinations: React.PropTypes.object.isRequired,
  searchDesHide: React.PropTypes.func.isRequired,
  fetchSearchDestination: React.PropTypes.func.isRequired,
  isShow: React.PropTypes.string.isRequired,
  destinationCities: React.PropTypes.object.isRequired
}

export default SearchDestination
