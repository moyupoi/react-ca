import React, { Component } from 'react'
import { Input, Form } from 'antd'
const FormItem = Form.Item

class Counter extends Component {

  componentDidMount () {
  }

  render () {
    const { getFieldProps } = this.props.form
    return (
      <div className='filter-guest-box'>
        <FormItem prefixCls='guest'>
          <div className='guest-minus'></div>
          <Input {...getFieldProps('guestNumber')} defaultValue='人数不限' />
          <div className='guest-addition'></div>
        </FormItem>
      </div>
    )
  }
}

Counter.propTypes = {
}

export default Counter

// 先处理无房源逻辑的
// 假设有OfferId
// ...offerMinNights, Priceable, 获取接口，处理房源
