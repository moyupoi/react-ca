import React, { Component } from 'react'
import { Modal, message, Form, Input } from 'antd'
const FormItem = Form.Item
import update from 'react-addons-update'

import styles from '../assets/MyDatePicker.scss'

class MyDatePicker extends Component {

  constructor (props) {
    super(props)
    this.tdClick = this.tdClick.bind(this)
    this.state = {
      open: false,
      schedule: 1,
      dateListIndex: [],
      dateListArray: [],
      monthList: [],
      yearList: [],
      startId: false,
      startYear: false,
      startMonth: false,
      constructDate: true,
      showDateMessage: false,
      pattern: ''
    }
  }

  handleClick () {
    this.setState({
      open: !this.state.open
    })
  }

  componentWillMount () {
    if (this.state.constructDate && this.props.fetchedDates.items) {
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
      if (this.props.startDate && this.props.endDate) {
        let sDate = new Date(this.props.startDate)
        let eDate = new Date(this.props.endDate)
        this.setState({
          dateListIndex: monthDate,
          dateListArray: monthDateList,
          monthList: monthArray,
          yearList: yearArray,
          constructDate: false,
          pattern: this.props.pattern,
          schedule: 3,
          showDateMessage: this.structureDateMessage(sDate.getFullYear(), sDate.getMonth() + 1, sDate.getDate(), eDate.getFullYear(), eDate.getMonth() + 1, eDate.getDate())
        })
      } else {
        this.setState({
          dateListIndex: monthDate,
          dateListArray: monthDateList,
          monthList: monthArray,
          yearList: yearArray,
          constructDate: false,
          pattern: this.props.pattern,
          showDateMessage: false,
          schedule: 1
        })
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if ((this.state.constructDate && (nextProps.fetchedDates.items || nextProps.pattern == 'two')) || (this.props.endDate && !nextProps.endDate && !nextProps.startDate)) {
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
      if (nextProps.startDate && nextProps.endDate) {
        let sDate = new Date(nextProps.startDate)
        let eDate = new Date(nextProps.endDate)
        this.setState({
          dateListIndex: monthDate,
          dateListArray: monthDateList,
          monthList: monthArray,
          yearList: yearArray,
          constructDate: false,
          pattern: nextProps.pattern,
          schedule: 3,
          showDateMessage: this.structureDateMessage(sDate.getFullYear(), sDate.getMonth() + 1, sDate.getDate(), eDate.getFullYear(), eDate.getMonth() + 1, eDate.getDate())
        })
      } else {
        this.setState({
          dateListIndex: monthDate,
          dateListArray: monthDateList,
          monthList: monthArray,
          yearList: yearArray,
          constructDate: false,
          pattern: nextProps.pattern,
          showDateMessage: false,
          schedule: 1
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
      let dateMessage = nextProps.fetchedDates.items ? {day: j + 1, type: 3, price: '已租'} : {day: j + 1, type: 2, price: ''}
      if (thisDate.getTime() < today.getTime() + 2 * 86400000) {
        dateMessage.day = j + 1
        dateMessage.type = 1
        dateMessage.price = ''
      } else {
        nextProps.fetchedDates.items && nextProps.fetchedDates.items.dates.map((item) => {
          if (thisDate.getTime() == _self.dateFormat(item.date) && item.available) {
            dateMessage.day = j + 1
            dateMessage.type = 2
            dateMessage.price = '¥' + item.price
          }
        })
        if (nextProps.startDate && nextProps.endDate) {
          if (thisDate.getTime() == _self.dateFormat(nextProps.startDate)) {
            dateMessage.type = 4
          } else if (thisDate.getTime() == _self.dateFormat(nextProps.endDate)) {
            dateMessage.type = 7
          } else if (_self.dateFormat(nextProps.startDate) < thisDate.getTime() && thisDate.getTime() < _self.dateFormat(nextProps.endDate)) {
            dateMessage.type = 8
          }
        }
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
    let endDate = new Date(eYear + '-' + ((eMonth) > 9 ? '' : '0') + eMonth + '-' + (eDay > 9 ? '' : '0') + eDay)
    var spaceDay = Math.abs((startDate.getTime() - endDate.getTime())) / (1000 * 60 * 60 * 24)
    let week = ['日', '一', '二', '三', '四', '五', '六']
    let startObj = {month: sMonth, day: sDay, weekDay: week[startDate.getDay()], year: sYear}
    let endObj = {month: eMonth, day: eDay, weekDay: week[endDate.getDay()], year: eYear}
    return [startObj, endObj, spaceDay]
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

  // 进度1操作函数
  scheduleOne (id, type, minNight, year, month) {
    let avaiableClick = true
    for (let i = id; i < id + minNight; i++) {
      if (!this.state.dateListArray[i + 1] || this.state.dateListArray[i].dateMessage.type != 2) {
        avaiableClick = false
      }
    }
    if (type == 2 && !avaiableClick) {
      message.warning('最少入住' + minNight + '天')
    } else if (type == 2) {
      let retroState = this.state.dateListArray
      let breakpoint = false
      this.muchTimeStateChange(id, 4, retroState)
      for (let i = 0; i < id; i++) {
        if (this.state.dateListArray[i].dateMessage.type == 2) {
          this.muchTimeStateChange(i, 5, retroState)
        }
      }
      for (let k = id + 1; k < id + minNight; k++) {
        this.muchTimeStateChange(k, 5, retroState)
      }
      for (let j = id; j < this.state.dateListArray.length; j++) {
        if (this.state.dateListArray[j].dateMessage.type == 3) {
          this.muchTimeStateChange(j, 6, retroState)
          breakpoint = j
          break
        }
      }
      if (breakpoint) {
        for (let l = breakpoint; l < this.state.dateListArray.length; l++) {
          if (this.state.dateListArray[l].dateMessage.type == 2) {
            this.muchTimeStateChange(l, 5, retroState)
          }
        }
      }
      if (this.state.pattern == 'two') {
        this.props.onChangeEndDate('', '')
        this.setState({dateListArray: retroState, schedule: 2, startId: id, startYear: year, startMonth: month, showDateMessage: false})
      } else {
        this.setState({dateListArray: retroState, schedule: 2, startId: id, startYear: year, startMonth: month})
      }
    }
  }

  // 进度2操作函数
  scheduleTwo (id, type, minNight, year, month) {
    if (type == 4) {
      let retroState = this.state.dateListArray
      this.muchTimeStateChange(id, 2, retroState)
      for (let i = 0; i < this.state.dateListArray.length; i++) {
        if (this.state.dateListArray[i].dateMessage.type == 5) {
          this.muchTimeStateChange(i, 2, retroState)
        }
      }
      for (let k = id + 1; k < id + minNight; k++) {
        this.muchTimeStateChange(k, 2, retroState)
      }
      for (let j = id; j < this.state.dateListArray.length; j++) {
        if (this.state.dateListArray[j].dateMessage.type == 6) {
          this.muchTimeStateChange(j, 3, retroState)
          break
        }
      }
      this.setState({dateListArray: retroState, schedule: 1, startId: false})
    } else if (type == 2) {
      let retroState = this.state.dateListArray
      this.muchTimeStateChange(id, 7, retroState)
      for (let h = 0; h < this.state.dateListArray.length; h++) {
        if (this.state.dateListArray[h].dateMessage.type == 5) {
          this.muchTimeStateChange(h, 2, retroState)
        }
      }
      for (let i = this.state.startId + 1; i < id; i++) {
        this.muchTimeStateChange(i, 8, retroState)
      }
      for (let j = id; j < this.state.dateListArray.length; j++) {
        if (this.state.dateListArray[j].dateMessage.type == 6) {
          this.muchTimeStateChange(j, 3, retroState)
        }
      }
      // 提交表单(onchangeEndDate传入start  end 的日期)
      this.props.onChangeEndDate(this.standardDate(this.state.startYear, this.state.startMonth, this.state.dateListArray[this.state.startId].dateMessage.day), this.standardDate(year, month, this.state.dateListArray[id].dateMessage.day))
      this.setState({dateListArray: retroState, schedule: 3, open: false, showDateMessage: this.structureDateMessage(this.state.startYear, this.state.startMonth, this.state.dateListArray[this.state.startId].dateMessage.day, year, month, this.state.dateListArray[id].dateMessage.day)})
    } else if (type == 6) {
      let retroState = this.state.dateListArray
      this.muchTimeStateChange(id, 9, retroState)
      for (let h = 0; h < this.state.dateListArray.length; h++) {
        if (this.state.dateListArray[h].dateMessage.type == 5) {
          this.muchTimeStateChange(h, 2, retroState)
        }
      }
      for (let i = this.state.startId + 1; i < id; i++) {
        this.muchTimeStateChange(i, 8, retroState)
      }
      this.props.onChangeEndDate(this.standardDate(this.state.startYear, this.state.startMonth, this.state.dateListArray[this.state.startId].dateMessage.day), this.standardDate(year, month, this.state.dateListArray[id].dateMessage.day))
      this.setState({dateListArray: retroState, schedule: 3, open: false, showDateMessage: this.structureDateMessage(this.state.startYear, this.state.startMonth, this.state.dateListArray[this.state.startId].dateMessage.day, year, month, this.state.dateListArray[id].dateMessage.day)})
    }
  }

  // 进度3操作的函数
  scheduleThree (id, type, minNight, year, month) {
    let retroState = this.state.dateListArray
    let twoArr = [2, 4, 7, 8]
    for (let i = 0; i < this.state.dateListArray.length; i++) {
      if (this.state.dateListArray[i].dateMessage.type == 4 || this.state.dateListArray[i].dateMessage.type == 7 || this.state.dateListArray[i].dateMessage.type == 8) {
        this.muchTimeStateChange(i, 2, retroState)
      } else if (this.state.dateListArray[i].dateMessage.type == 9) {
        this.muchTimeStateChange(i, 3, retroState)
      }
    }
    let avaiableClick = true
    for (let i = id; i < id + minNight; i++) {
      if (!retroState[i + 1] || retroState[i].dateMessage.type != 2) {
        avaiableClick = false
      }
      if (type != 2 && type != 4 && type != 7 && type != 8) {
        avaiableClick = true
      }
    }
    if (!avaiableClick) {
      message.warning('最少入住' + minNight + '天')
      this.setState({dateListArray: retroState, schedule: 1, startId: false})
    } else if (twoArr.indexOf(type) != -1) {
      let breakpoint = false
      this.muchTimeStateChange(id, 4, retroState)
      for (let i = 0; i < id; i++) {
        if (twoArr.indexOf(this.state.dateListArray[i].dateMessage.type) != -1) {
          this.muchTimeStateChange(i, 5, retroState)
        }
      }
      for (let k = id + 1; k < id + minNight; k++) {
        this.muchTimeStateChange(k, 5, retroState)
      }
      for (let j = id; j < this.state.dateListArray.length; j++) {
        if (this.state.dateListArray[j].dateMessage.type == 3 || this.state.dateListArray[j].dateMessage.type == 9) {
          this.muchTimeStateChange(j, 6, retroState)
          breakpoint = j
          break
        }
      }
      if (breakpoint) {
        for (let l = breakpoint; l < this.state.dateListArray.length; l++) {
          if (twoArr.indexOf(this.state.dateListArray[l].dateMessage.type) != -1) {
            this.muchTimeStateChange(l, 5, retroState)
          }
        }
      }
      if (this.state.pattern == 'two') {
        this.props.onChangeEndDate(this.standardDate(year, month, this.state.dateListArray[id].dateMessage.day), '')
        this.setState({dateListArray: retroState, schedule: 2, startId: id, startYear: year, startMonth: month, showDateMessage: false})
      } else {
        this.setState({dateListArray: retroState, schedule: 2, startId: id, startYear: year, startMonth: month})
      }
    }
  }

  // 点击事件
  tdClick (id, type, minNight, year, month) {
    // 进度1:
    if (this.state.schedule == 1) {
      this.scheduleOne(id, type, minNight, year, month)
    }
    // 进度2:
    else if (this.state.schedule == 2) {
      this.scheduleTwo(id, type, minNight, year, month)
    }
    // 进度3:(还和进度1有点不同type多的一匹)
    else if (this.state.schedule == 3) {
      this.scheduleThree(id, type, minNight, year, month)
    }
  }

  // 显示退房入住啊等字样
  characterShow (type) {
    var character
    switch (type) {
      case 4:
        character = '入住'
        break
      case 6:
        character = '仅退房'
        break
      case 7:
        character = '退房'
        break
      case 9:
        character = '退房'
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
    const startDateProps = {
      rules: [
        { required: true, message: '　' }
      ]
    }

    const endDateProps = {
      rules: [
        { required: true, message: '请选择入住时间与退房时间' }
      ]
    }
    return (
      <div className={styles.datePickerContent}>
        {this.props.pattern != 'three' &&
          <div className='filter-date-box' onClick={() => this.handleClick()}>
            {!this.state.showDateMessage &&
            <div>
              <div className={styles.dateMessageOne}><img src={dateIcon} /></div>
              <div className={styles.dateMessageTwo}><p className={styles.beforePTwo}>入住时间</p></div>
              <div className={styles.dateMessageThree}><div className={styles.beforeDiv}></div></div>
              <div className={styles.dateMessageFour}><p className={styles.beforePFour}>退房时间</p></div>
            </div>
            }
            {this.state.showDateMessage &&
            <div>
              <div className={styles.dateMessageOne}><img src={dateIcon} /></div>
              <div className={styles.dateMessageTwo}><p className={styles.afterPOne}>{this.state.showDateMessage[0].month}月{this.state.showDateMessage[0].day}日</p><p className={styles.afterPTwo}>周{this.state.showDateMessage[0].weekDay}{this.state.showDateMessage[0].year}年</p></div>
              <div className={styles.dateMessageThree}><div className={styles.afterDiv}>共{this.state.showDateMessage[2]}晚</div></div>
              <div className={styles.dateMessageFour}><p className={styles.afterPOne}>{this.state.showDateMessage[1].month}月{this.state.showDateMessage[1].day}日</p><p className={styles.afterPTwo}>周{this.state.showDateMessage[1].weekDay}{this.state.showDateMessage[1].year}年</p></div>
            </div>
            }
            <FormItem>
              {getFieldDecorator('startDate', startDateProps)(
                <Input type='hidden' />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('endDate', endDateProps)(
                <Input type='hidden' />
              )}
            </FormItem>
          </div>
        }
        {this.props.pattern == 'one' &&
          <Modal visible={this.state.open} width='100%' wrapClassName='modalContent' style={{top: '0', paddingBottom: '0', margin: '0'}} onCancel={() => this.handleClick()}>
            <div className={styles.myDatePicker}>
              <div className={styles.top}>
                <div>选择入住日期(至少{minNight}天)<span onClick={() => this.handleClick()}>取消</span></div>
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
              <div style={{height: '.8rem'}}></div>
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
                            <div className={styles.priceTag} style={this.state.dateListArray[everyDay].dateMessage.type == 5 ? {color: '#c0c0c8'} : {}}>
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
          </Modal>
        }
        {this.props.pattern == 'two' &&
          <div className={styles.myDatePicker} style={{width: '3.43rem', height: '3.42rem', marginLeft: '.16rem', border: '1px solid #d9d9de', borderTop: 'none', display: this.state.open ? '' : 'none'}}>
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
        }
        {this.props.pattern == 'three' &&
        <div className={styles.myDatePicker} style={{width: '3.12rem'}}>
          <div className={styles.topThree}>
            <div>可租价格日历</div>
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
          <div style={{height: '1.1rem'}}></div>
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
                    <td key={index + '+' + i} className={this.state.dateListArray[everyDay] && this.selectTdClassName(this.state.dateListArray[everyDay].dateMessage.type)}>
                      {this.state.dateListArray[everyDay] &&
                      <div>
                        <div>
                          {this.state.dateListArray[everyDay].dateMessage.day}
                        </div>
                        <div className={styles.priceTagThree} style={this.state.dateListArray[everyDay].dateMessage.type == 5 ? {color: '#c0c0c8'} : {}}>
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
        }
      </div>
    )
  }
}

MyDatePicker.propTypes = {
}

export default MyDatePicker
