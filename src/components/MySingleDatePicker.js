import React, { Component } from 'react'
import { Modal, message, Form, Input } from 'antd'
const FormItem = Form.Item
import update from 'react-addons-update'

import styles from '../assets/MySingleDatePicker.scss'

class MySingleDatePicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      dateListIndex: [],
      dateListArray: [],
      monthList: [],
      yearList: [],
      startYear: false,
      constructDate: true,
      showDateMessage: false
    }
  }

  static defaultProps = {
    selectedDate: '',
    startDate: '',
    endDate: ''
  }

  handleClick () {
    this.setState({
      open: !this.state.open
    })
  }

  componentWillMount () {
    if (this.state.constructDate) {
      const today = new Date()
      let thisYear = today.getFullYear()
      let thisMonth = today.getMonth() + 1
      let monthDate = []
      let monthDateList = []
      let monthArray = []
      let yearArray = []
      for (let i = 0; i < 13; i++) {
        monthArray.push(thisMonth)
        yearArray.push(thisYear)
        this.setMonthDateArray(thisYear, thisMonth, monthDate, monthDateList, this.props)
        thisMonth = thisMonth + 1
        if (thisMonth > 12) {
          thisMonth = 1
          thisYear = thisYear + 1
        }
      }
      if (this.props.selectedDate) {
        let sDate = new Date(this.props.selectedDate)
        this.setState({
          dateListIndex: monthDate,
          dateListArray: monthDateList,
          monthList: monthArray,
          yearList: yearArray,
          constructDate: false,
          showDateMessage: this.structureDateMessage(sDate.getFullYear(), sDate.getMonth() + 1, sDate.getDate())
        })
      } else {
        this.setState({
          dateListIndex: monthDate,
          dateListArray: monthDateList,
          monthList: monthArray,
          yearList: yearArray,
          constructDate: false,
          showDateMessage: false,
        })
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.constructDate) {
      const today = new Date()
      let thisYear = today.getFullYear()
      let thisMonth = today.getMonth() + 1
      let monthDate = []
      let monthDateList = []
      let monthArray = []
      let yearArray = []
      for (let i = 0; i < 13; i++) {
        monthArray.push(thisMonth)
        yearArray.push(thisYear)
        this.setMonthDateArray(thisYear, thisMonth, monthDate, monthDateList, nextProps)
        thisMonth = thisMonth + 1
        if (thisMonth > 12) {
          thisMonth = 1
          thisYear = thisYear + 1
        }
      }
      if (nextProps.selectedDate) {
        let sDate = new Date(nextProps.selectedDate)
        this.setState({
          dateListIndex: monthDate,
          dateListArray: monthDateList,
          monthList: monthArray,
          yearList: yearArray,
          constructDate: false,
          showDateMessage: this.structureDateMessage(sDate.getFullYear(), sDate.getMonth() + 1, sDate.getDate())
        })
      } else {
        this.setState({
          dateListIndex: monthDate,
          dateListArray: monthDateList,
          monthList: monthArray,
          yearList: yearArray,
          constructDate: false,
          showDateMessage: false,
        })
      }
    }
  }

  // 格式化时间
  dateFormat (value) {
    let myDateArr = value.split('-')
    let myDate = new Date(myDateArr[0], myDateArr[1] - 1, myDateArr[2])
    return myDate.getTime()
  }

  // 所有日历信息塞进数组 (type: 1(今天延后两天前); 2(可租,有价格); 3不可租)
  setMonthDateArray (year, month, monthDate, monthDateList, nextProps) {
    let _self = this
    let today = new Date()
    // console.log(today.getDate())
    let firstDay = new Date(year + '-' + (month > 9 ? month : '0' + month) + '-01')
    let monthAllDay = new Date(year, month, 0)
    let monthCount = monthAllDay.getDate()
    let monthContent = []
    let weekIndex = 0
    for (let k = 0; k < 6; k++) {
      monthContent[k] = []
    }
    for (let i = 0; i < firstDay.getDay(); i++) {
      monthContent[weekIndex].push(555)
    }
    for (let j = 0; j < monthCount; j++) {
      let thisDate = new Date(year, month - 1, j + 1)
      let dateMessage = {day: j + 1, type: 2, price: ''}
      let startDate = new Date(nextProps.startDate)
      let endDate = new Date(nextProps.endDate)
      if (nextProps.startDate && nextProps.endDate) {
        if (thisDate.getTime() > startDate.getTime() && thisDate.getTime() < endDate.getTime() ) {
          dateMessage.day = j + 1
          dateMessage.type = 2
          dateMessage.price = ''
        } else {
          dateMessage.day = j + 1
          dateMessage.type = 1
          dateMessage.price = ''
        }
      } else {
        dateMessage.day = j + 1
        dateMessage.type = 2
        dateMessage.price = ''
      }
      if (thisDate.getTime() === _self.dateFormat(nextProps.selectedDate)) {
        dateMessage.day = j + 1
        dateMessage.type = 4
        dateMessage.price = ''
      }
      if (monthContent[weekIndex].length < 7) {
        monthContent[weekIndex].push(monthDateList.length)
        monthDateList.push({dateMessage})
      } else {
        weekIndex++
        monthContent[weekIndex].push(monthDateList.length)
        monthDateList.push({dateMessage})
      }
    }
    monthDate.push(monthContent)
  }

  // 决定每个td样式
  selectTdClassName (type) {
    var tdClassName
    switch (type)
    {
      case 1:
        tdClassName = styles.tdOne
        break
      case 2:
        tdClassName = styles.tdTwo
        break
      case 3:
        tdClassName = styles.tdThree
        break
      case 4:
        tdClassName = styles.tdFour
        break
      case 5:
        tdClassName = styles.tdFive
        break
      case 6:
        tdClassName = styles.tdSix
        break
      case 7:
        tdClassName = styles.tdSeven
        break
      case 8:
        tdClassName = styles.tdEight
        break
      case 9:
        tdClassName = styles.tdNine
        break
    }
    return tdClassName
  }

  // 规范提交日期
  standardDate (year, month, day) {
    return year + '-' + ((month) > 9 ? '' : '0') + (month) + '-' + (day > 9 ? '' : '0') + day
  }

  // 构造需要显示的数据 (startDate, endDate, 间隔日)
  structureDateMessage (sYear, sMonth, sDay, eYear, eMonth, eDay) {
    let startDate = new Date(sYear + '-' + ((sMonth) > 9 ? '' : '0') + sMonth + '-' + (sDay > 9 ? '' : '0') + sDay)
    let week = ['日', '一', '二', '三', '四', '五', '六']
    let startObj = {month: sMonth, day: sDay, weekDay: week[startDate.getDay()], year: sYear}
    return [startObj]
  }

  // 替换state中type函数(单个)
  stateChange (id, type) {
    let newDateMessage = {dateMessage: update(this.state.dateListArray[id].dateMessage, {type: {$set: type}})}
    let newState = update(this.state.dateListArray, {$splice: [[id, 1, newDateMessage]]})
    this.setState({
      dateListArray: newState
    })
  }

  // 替换state中的type(重复使用)
  muchTimeStateChange (id, type, retroState) {
    retroState[id].dateMessage.type = type
  }

  tdClick (id, type, minNight, year, month) {
    let retroState = this.state.dateListArray
    for (let i = 0; i < 365; i++) {
      if (this.state.dateListArray[i].dateMessage.type == 4) {
        this.muchTimeStateChange(i, 2, retroState)
      }
    }
    if (type == 2) {
      this.muchTimeStateChange(id, 4, retroState)
      let messageMonth = month > 9 ? month : ('0' + month)
      let day = this.state.dateListArray[id].dateMessage.day
      let messageDay = day > 9 ? day : ('0' + day)
      this.setState({dateListArray: retroState, open:false, showDateMessage: this.structureDateMessage(year, messageMonth, messageDay)})
    }
    let selectDay = this.standardDate(year, month, this.state.dateListArray[id].dateMessage.day)
    this.props.handleChange(selectDay)
  }

  // 显示退房入住啊等字样
  characterShow (type) {
    var character
    switch (type) {
      case 4:
        character = '预订'
        break
      default:
        character = false
    }
    return character
  }

  render () {
    const minNight = this.props.minNight
    const { getFieldDecorator } = this.props.form
    const dateIcon = require('../assets/dateIcon.jpg')
    const selectedDate = {
      rules: [
        { required: true, message: '请选择预订日期' }
      ]
    }

    return (
      <div className={styles.datePickerContent}>
        <div className='filter-one-date-box' onClick={() => this.handleClick()}>
          {!this.state.showDateMessage &&
            <div>
              <div className={styles.dateMessageOne}><img src={dateIcon} /></div>
              <div className={styles.dateMessageTwo}><p className={styles.beforePTwo}>选择时间</p></div>
            </div>
          }
          {this.state.showDateMessage &&
            <div>
              <div className={styles.dateMessageOne}><img src={dateIcon} /></div>
              <div className={styles.dateMessageTwo}><p className={styles.afterPOne}>{this.state.showDateMessage[0].year}-{this.state.showDateMessage[0].month}-{this.state.showDateMessage[0].day}</p></div>
            </div>
          }
          <FormItem>
            {getFieldDecorator('selectedDate', selectedDate)(
              <Input type='hidden' />
            )}
          </FormItem>
        </div>
        <div className={styles.myDatePicker} style={{width: '3.51rem', height: '3.42rem', border: '1px solid #d9d9de', borderTop: 'none', display: this.state.open ? '' : 'none'}}>
          <div className={styles.toptwo}>
            <table style={{background: 'white'}}>
              <tbody>
              <tr>
                <th>日</th>
                <th>一</th>
                <th>二</th>
                <th>三</th>
                <th>四</th>
                <th>五</th>
                <th>六</th>
              </tr>
              </tbody>
            </table>
          </div>
          <div style={{overflowY: 'scroll', height: '3rem'}}>
            {this.state.dateListIndex.map((everyMonth, index) =>
              <table key={index}>
                <tbody>
                  <tr style={index == 0 ? {} : {borderTop: '1px solid #e6e6e9'}}>
                    <td style={{textAlign: 'left'}} colSpan='7'>
                      <span className={styles.monthSpan}>{this.state.monthList[index]}月</span>
                      <span style={{fontSize: '.12rem'}}>{this.state.yearList[index]}</span>
                    </td>
                  </tr>
                  {everyMonth.map((everyWeek, i) =>
                  <tr key={index + '-' + i}>
                    {everyWeek.map((everyDay, i) =>
                      <td key={index + '+' + i} className={this.state.dateListArray[everyDay] && this.selectTdClassName(this.state.dateListArray[everyDay].dateMessage.type)} onClick={() => this.tdClick(everyDay, this.state.dateListArray[everyDay].dateMessage.type, minNight, this.state.yearList[index], this.state.monthList[index])}>
                        {this.state.dateListArray[everyDay] &&
                        <div>
                          <div>
                            {this.state.dateListArray[everyDay].dateMessage.day}
                          </div>
                          <div className={styles.priceTagTwo} style={this.state.dateListArray[everyDay].dateMessage.type == 5 ? {color: '#c0c0c8'} : {}}>
                            {this.characterShow(this.state.dateListArray[everyDay].dateMessage.type) ? this.characterShow(this.state.dateListArray[everyDay].dateMessage.type) : this.state.dateListArray[everyDay].dateMessage.price}
                          </div>
                        </div>
                        }
                      </td>
                    )}
                  </tr>
                )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    )
  }
}

MySingleDatePicker.propTypes = {
}

export default MySingleDatePicker
