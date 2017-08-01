import React, { Component } from 'react'
import { DatePicker, Form } from 'antd'
const FormItem = Form.Item

class DatePickerZ extends Component {

  componentDidMount () {
  }

  // return 2天以后的入住日期
  disabledDateStart (current) {
    return current && current.getTime() < Date.now() + 1000 * 60 * 60 * 24 * 2
  }

  disabledDateEnd (current) {
  }

  render () {
    const { getFieldProps } = this.props.form
    return (
      <div className='filter-date-box'>
        <FormItem label='入住日期' prefixCls='date-from'>
          <DatePicker {...getFieldProps('startDate')} placeholder='选择' />
        </FormItem>
        <FormItem label='退房日期' prefixCls='date-to'>
          <DatePicker {...getFieldProps('endDate')} placeholder='____' />
        </FormItem>
      </div>
    )
  }
}

DatePickerZ.propTypes = {
}

export default DatePickerZ

// 先处理无房源逻辑的
// 假设有OfferId
// ...offerMinNights, Priceable, 获取接口，处理房源
