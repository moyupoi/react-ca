import React, { Component, PropTypes } from 'react'
import { message } from 'antd'
import { isEmpty } from 'lodash/fp'
import { saBtnClick, saOperation } from 'tools/sensors'

class OfferLike extends Component {
  // 使用说明: 传入props
  // example: user={this.props.user} offerId={offer.id} offerChangeLike={this.props.offerChangeLike} offerLike={this.props.offerLike};
  // styleOut和styleIn为可选参数 example: styleIn={{color: 'red', background: 'red'}}
  // usage字段为标示个人收藏专用

  constructor (props, context) {
    super(props, context)
    if (!isEmpty(props.user.info) && props.user.info.liked_offer_ids.find((n) => n == props.offerId)) {
      this.state = {
        liked: true
      }
    } else {
      this.state = {
        liked: false
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.usage) {
      if (!isEmpty(nextProps.user.info) && nextProps.user.info.liked_offer_ids.find((n) => n == nextProps.offerId)) {
        this.state = {
          liked: true
        }
      } else {
        this.state = {
          liked: false
        }
      }
    }
  }

  switchOfferLikeable (event, offerId, likeable) {
    const { offerChangeLike } = this.props
    if (this.props.user.signed) {
      if (likeable == 'unlike') {
        message.info('取消收藏成功', 1)
        // 埋点 - - 取消收藏
        saOperation(this.props.category, '取消收藏', Number(offerId), this.props.offerName)
      } else {
        message.info('收藏成功', 1)

        // 埋点 - - 收藏
        saOperation(this.props.category, '添加收藏', Number(offerId), this.props.offerName)
      }
      offerChangeLike(offerId, likeable)
      this.setState({ liked: !this.state.liked })
    } else {
      // 埋点 - - 未登录收藏
      let category
      (/^\/[A-Za-z]+[^\/]*$/.test(window.location.pathname)) ? (category = '搜索结果页') : category = ''
      saBtnClick('收藏', category ? category : this.props.category)

      message.info('请先登录', 2)
      this.context.router.push('/users/sign_in')
    }
  }

  render () {
    return (
      <div style={this.props.styleOut ? this.props.styleOut : {}}>
        {this.state.liked && <div style={this.props.styleIn ? this.props.styleIn : {}} className='collect-already collect-btn' onClick={() => this.switchOfferLikeable(event, this.props.offerId, 'unlike')}>{this.props.word && '收藏'}</div>}
        {!this.state.liked && <div style={this.props.styleIn ? this.props.styleIn : {}} className='collect-not collect-btn' onClick={() => this.switchOfferLikeable(event, this.props.offerId, 'like')}>{this.props.word && '收藏'}</div>}
      </div>
    )
  }
}

OfferLike.propTypes = {
  offerChangeLike: React.PropTypes.func.isRequired
}

OfferLike.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default OfferLike
