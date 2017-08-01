import React, { Component } from 'react'
import Helmet from 'react-helmet'

import error from './assets/Error.png'
import s from './assets/NotFound.scss'

class NotFound extends Component {
  render () {
    return (
      <div className={s.notFundContain}>
        <Helmet title='404页面' />
        <img className={s.notFoundImg} src={error} />
        <em className={s.statusCode}>404</em>
        <p className={s.notFoundExplain}>哎呦，这扇门打不开了...</p>
        <a href='/' className={s.notFoundHome}>查看首页</a>
      </div>
    )
  }
}

export default NotFound
