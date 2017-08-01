import { CALL_API } from 'redux-api-middleware'
import cookie from 'react-cookie'
import { extend, isUndefined } from 'lodash/fp'
var _ = require('underscore')

import config from 'config'

// 新增 utm_source、download_channel 字段
let header = function () {
  let distinctId = isUndefined(sa) ? '' : (sa.store.getDistinctId() || sa._.UUID())
  let token = window.RCD.access_token || undefined
  let utmSource = cookie.load('utm_source') || window.RCD.utm_source
  let downloadChannel = window.RCD.download_channel || undefined
  let ua = navigator.userAgent.toLowerCase()
  let appChannel
  if(ua.match(/MicroMessenger/i)) {
    if(cookie.load('wx_open_id') || cookie.load('visitor_open_id')) {
      appChannel = 'wechat_mp'
    }
  }
  let pHeader = extend(config.headers, { 'Authorization': token, 'X-ZBJ-WX-UID': cookie.load('wx_open_id'), 'X-ZBJ-Inviter-Code': cookie.load('icCode'), 'X-ZBJ-Utm-Source': utmSource, 'X-ZBJ-App-Channel': downloadChannel, 'X-ZBJ-Distinct-ID': distinctId, 'X-ZBJ-App-Channel': appChannel })
  return _.omit(pHeader, function (value) {
    return isUndefined(value)
  })
}

// Constants
export const LOGIN_CODE_REQUEST = 'LOGIN_CODE_REQUEST'
export const LOGIN_CODE_SUCCESS = 'LOGIN_CODE_SUCCESS'
export const LOGIN_CODE_FAILURE = 'LOGIN_CODE_FAILURE'

export const REG_CODE_REQUEST = 'REG_CODE_REQUEST'
export const REG_CODE_SUCCESS = 'REG_CODE_SUCCESS'
export const REG_CODE_FAILURE = 'REG_CODE_FAILURE'

export const BASIC_AUTH_REQUEST = 'BASIC_AUTH_REQUEST'
export const BASIC_AUTH_SUCCESS = 'BASIC_AUTH_SUCCESS'
export const BASIC_AUTH_FAILURE = 'BASIC_AUTH_FAILURE'

export const DYNAMIC_AUTH_REQUEST = 'DYNAMIC_AUTH_REQUEST'
export const DYNAMIC_AUTH_SUCCESS = 'DYNAMIC_AUTH_SUCCESS'
export const DYNAMIC_AUTH_FAILURE = 'DYNAMIC_AUTH_FAILURE'

export const REG_EMAIL_REQUEST = 'REG_EMAIL_REQUEST'
export const REG_EMAIL_SUCCESS = 'REG_EMAIL_SUCCESS'
export const REG_EMAIL_FAILURE = 'REG_EMAIL_FAILURE'

export const REG_PHONE_REQUEST = 'REG_PHONE_REQUEST'
export const REG_PHONE_SUCCESS = 'REG_PHONE_SUCCESS'
export const REG_PHONE_FAILURE = 'REG_PHONE_FAILURE'

export const GETME_REQUEST = 'GETME_REQUEST'
export const GETME_SUCCESS = 'GETME_SUCCESS'
export const GETME_FAILURE = 'GETME_FAILURE'

export const TOKEN_NOEXIST = 'TOKEN_NOEXIST'
export const TOKEN_EXIST = 'TOKEN_EXIST'

export const CLEAN_COOKIE = 'CLEAN_COOKIE'

export const UPDATE_SOURCE_REQUEST = 'REG_PHONE_REQUEST'
export const UPDATE_SOURCE_SUCCESS = 'REG_PHONE_SUCCESS'
export const UPDATE_SOURCE_FAILURE = 'REG_PHONE_FAILURE'

export const FETCH_ZHIMA_REQUEST = 'FETCH_ZHIMA_REQUEST'
export const FETCH_ZHIMA_SUCCESS = 'FETCH_ZHIMA_SUCCESS'
export const FETCH_ZHIMA_FAILURE = 'FETCH_ZHIMA_FAILURE'

// Actions
// 获取登录手机验证码
export function loginCode (mobile = '') {
  return {
    [CALL_API]: {
      endpoint: config.api_root_v1 + '/users/send_mobile_login_code',
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        mobile
      }),
      types: [
        LOGIN_CODE_REQUEST,
        {
          type: LOGIN_CODE_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        {
          type: LOGIN_CODE_FAILURE,
          payload: (action, state, res) => {
            if (res) {
              return res.json()
            } else {
              return {
                errors: { status: 500 },
                message: '服务器请求故障'
              }
            }
          }
        }
      ]
    }
  }
}

// 基本登录
export function basicAuth (login, password) {
  return {
    [CALL_API]: {
      endpoint: config.api_root_auth + '/oauth2/token',
      method: 'POST',
      headers: header(),
      body: JSON.stringify({
        login,
        password,
        'grant_type': 'password'
      }),
      types: [
        BASIC_AUTH_REQUEST,
        {
          type: BASIC_AUTH_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        {
          type: BASIC_AUTH_FAILURE,
          payload: (action, state, res) => {
            if (res) {
              return res.json()
            } else {
              return {
                errors: { status: 500 },
                message: '服务器请求故障'
              }
            }
          }
        }
      ]
    }
  }
}

// 手机动态登录
export function dynamicAuth (mobile, code, channel) {
  return {
    [CALL_API]: {
      endpoint: config.api_root_v1 + '/users/mobile_login',
      method: 'POST',
      headers: header(),
      body: JSON.stringify({
        mobile,
        code,
        channel
      }),
      types: [
        DYNAMIC_AUTH_REQUEST,
        {
          type: DYNAMIC_AUTH_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        {
          type: DYNAMIC_AUTH_FAILURE,
          payload: (action, state, res) => {
            if (res) {
              return res.json()
            } else {
              return {
                errors: { status: 500 },
                message: '服务器请求故障'
              }
            }
          }
        }
      ]
    }
  }
}

export function regCode (mobile = '') {
  return {
    [CALL_API]: {
      endpoint: config.api_root_v1 + '/users/send_reg_code',
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify({
        mobile
      }),
      types: [
        REG_CODE_REQUEST,
        {
          type: REG_CODE_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        {
          type: REG_CODE_FAILURE,
          payload: (action, state, res) => {
            if (res) {
              return res.json()
            } else {
              return {
                errors: { status: 500 },
                message: '服务器请求故障'
              }
            }
          }
        }
      ]
    }
  }
}

// 手机注册
export function regPhone (mobile, code, name, password, channel, source) {
  return {
    [CALL_API]: {
      endpoint: config.api_root_v1 + '/users/',
      method: 'POST',
      headers: header(),
      body: JSON.stringify({
        mobile,
        code,
        name,
        password,
        channel,
        source
      }),
      types: [
        REG_PHONE_REQUEST,
        {
          type: REG_PHONE_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        {
          type: REG_PHONE_FAILURE,
          payload: (action, state, res) => {
            if (res) {
              return res.json()
            } else {
              return {
                errors: { status: 500 },
                message: '服务器请求故障'
              }
            }
          }
        }
      ]
    }
  }
}

// 邮箱注册
export function regEmail (email, password, name, channel, source) {
  return {
    [CALL_API]: {
      endpoint: config.api_root_v1 + '/users/email',
      method: 'POST',
      headers: header(),
      body: JSON.stringify({
        email,
        password,
        name,
        channel,
        source
      }),
      types: [
        REG_EMAIL_REQUEST,
        {
          type: REG_EMAIL_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        {
          type: REG_EMAIL_FAILURE,
          payload: (action, state, res) => {
            if (res) {
              return res.json()
            } else {
              return {
                errors: { status: 500 },
                message: '服务器请求故障'
              }
            }
          }
        }
      ]
    }
  }
}

// 添加微信openId验证
export function getMe () {
  const token = cookie.load('token') || window.RCD.access_token
  const openId = cookie.load('wx_open_id')
  if (token || openId) {
    return {
      [CALL_API]: {
        endpoint: config.api_root_v1 + '/profile',
        method: 'GET',
        headers: extend(config.headers, { 'Authorization': `Bearer ${token}` }),
        types: [
          GETME_REQUEST,
          {
            type: GETME_SUCCESS,
            payload: (action, state, res) => {
              return res.json()
            }
          },
          GETME_FAILURE
        ]
      }
    }
  } else {
    return {
      type: TOKEN_NOEXIST
    }
  }
}

export function logout () {
  return {
    type: CLEAN_COOKIE
  }
}

export function signed () {
  const token = cookie.load('token') || window.RCD.access_token
  if (token) {
    return {
      type: TOKEN_EXIST
    }
  } else {
    return {
      type: TOKEN_NOEXIST
    }
  }
}

// 登录状态下存在utm_source 更新utm_source
export function updateCode (source) {
  const token = cookie.load('token') || window.RCD.access_token
  return {
    [CALL_API]: {
      endpoint: config.api_root_v1 + '/utm_source',
      method: 'POST',
      headers: extend(config.headers, { 'Authorization': `Bearer ${token}` }),
      body: JSON.stringify({
        'code': source
      }),
      types: [
        UPDATE_SOURCE_REQUEST,
        {
          type: UPDATE_SOURCE_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        {
          type: UPDATE_SOURCE_FAILURE,
          payload: (action, state, res) => {
            if (res) {
              return res.json()
            }
          }
        }
      ]
    }
  }
}

// 服务窗中 芝麻 登录
export function zhimaLogin (redirect_uri, openid) {
  return {
    [CALL_API]: {
      endpoint: config.api_root_v1 + '/users/zhima',
      method: 'POST',
      headers: header(),
      body: JSON.stringify({
        redirect_uri,
        openid
      }),
      types: [
        FETCH_ZHIMA_REQUEST,
        {
          type: FETCH_ZHIMA_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        {
          type: FETCH_ZHIMA_FAILURE,
          payload: (action, state, res) => {
            if (res) {
              return res.json()
            } else {
              return {
                errors: { status: 500 },
                message: '服务器请求故障'
              }
            }
          }
        }
      ]
    }
  }
}

export const actions = {
  loginCode,
  regCode,
  basicAuth,
  dynamicAuth,
  regEmail,
  regPhone,
  getMe,
  logout,
  signed,
  updateCode,
  zhimaLogin
}

// Action Handlers
const ACTION_HANDLERS = {
  [LOGIN_CODE_REQUEST]: (state, action) => {
    return ({ ...state, error: {}, cookie: false, signed: false })
  },
  [LOGIN_CODE_SUCCESS]: (state, action) => {
    cookie.save('newMember', false, { path: '/' })
    return ({ ...state, error: {}, cookie: false, signed: false })
  },
  [LOGIN_CODE_FAILURE]: (state, action) => {
    return ({ ...state, error: action.payload, cookie: false, signed: false })
  },
  [REG_CODE_REQUEST]: (state, action) => {
    return ({ ...state, error: {}, cookie: false, signed: false })
  },
  [REG_CODE_SUCCESS]: (state, action) => {
    return ({ ...state, error: {}, cookie: false, signed: false })
  },
  [REG_CODE_FAILURE]: (state, action) => {
    return ({ ...state, error: action.payload, cookie: false, signed: false })
  },
  [BASIC_AUTH_REQUEST]: (state, action) => {
    return ({ ...state, error: {}, cookie: false, signed: false })
  },
  [BASIC_AUTH_SUCCESS]: (state, action) => {
    const token = action.payload.access_token
    const refreshToken = action.payload.refresh_token
    cookie.save('token', token, { path: '/' })
    cookie.save('refreshToken', refreshToken, { path: '/' })
    cookie.save('newMember', false, { path: '/' })
    return ({ ...state, cookie: true, signed: true })
  },
  [BASIC_AUTH_FAILURE]: (state, action) => {
    return ({ ...state, error: action.payload, cookie: false, signed: false })
  },
  [DYNAMIC_AUTH_REQUEST]: (state, action) => {
    return ({ ...state, error: {}, cookie: false, signed: false })
  },
  [DYNAMIC_AUTH_SUCCESS]: (state, action) => {
    const token = action.payload.access_token
    const refreshToken = action.payload.refresh_token
    const newMember = action.payload.new_member
    cookie.save('token', token, { path: '/' })
    cookie.save('refreshToken', refreshToken, { path: '/' })
    cookie.save('newMember', newMember, { path: '/' })
    bindRemoveCookie(['utm_source'])
    return ({ ...state, cookie: true, signed: true })
  },
  [DYNAMIC_AUTH_FAILURE]: (state, action) => {
    return ({ ...state, error: action.payload, cookie: false, signed: false })
  },
  [REG_EMAIL_REQUEST]: (state, action) => {
    return ({ ...state, error: {}, cookie: false, signed: false })
  },
  [REG_EMAIL_SUCCESS]: (state, action) => {
    const token = action.payload.access_token
    const refreshToken = action.payload.refresh_token
    cookie.save('token', token, { path: '/' })
    cookie.save('refreshToken', refreshToken, { path: '/' })
    cookie.save('newMember', true, { path: '/' })
    return ({ ...state, cookie: true, signed: true })
  },
  [REG_EMAIL_FAILURE]: (state, action) => {
    return ({ ...state, error: action.payload, cookie: false, signed: false })
  },
  [REG_PHONE_REQUEST]: (state, action) => {
    return ({ ...state, error: {}, cookie: false, signed: false })
  },
  [REG_PHONE_SUCCESS]: (state, action) => {
    const token = action.payload.access_token
    const refreshToken = action.payload.refresh_token
    cookie.save('token', token, { path: '/' })
    cookie.save('refreshToken', refreshToken, { path: '/' })
    cookie.save('newMember', true, { path: '/' })
    return ({ ...state, cookie: true, signed: true })
  },
  [REG_PHONE_FAILURE]: (state, action) => {
    return ({ ...state, error: action.payload, cookie: false, signed: false })
  },
  [GETME_REQUEST]: (state, action) => {
    return ({ ...state, error: {} })
  },
  [GETME_SUCCESS]: (state, action) => {
    return ({ ...state, error: {}, cookie: true, signed: true, info: action.payload })
  },
  [GETME_FAILURE]: (state, action) => {
    return ({ ...state, error: {}, cookie: false, signed: false })
  },
  [TOKEN_NOEXIST]: (state, action) => {
    return ({ ...state, error: {}, cookie: false, signed: false })
  },
  [TOKEN_EXIST]: (state, action) => {
    return ({ ...state, error: {}, cookie: true, signed: true })
  },
  [CLEAN_COOKIE]: (state, action) => {
    cookie.remove('token', { path: '/' })
    return ({ ...state, error: {}, cookie: false, signed: false, info: '' })
  },
  [UPDATE_SOURCE_REQUEST]: (state, action) => {
    return ({ ...state, updateSource: { isFetching: true, info: '' } })
  },
  [UPDATE_SOURCE_SUCCESS]: (state, action) => {
    return ({ ...state, updateSource: { isFetching: false, info: action.payload } })
  },
  [UPDATE_SOURCE_FAILURE]: (state, action) => {
    return ({ ...state, updateSource: { isFetching: false } })
  },
  [FETCH_ZHIMA_REQUEST]: (state, action) => {
    return ({ ...state, error: {}, cookie: false, signed: false })
  },
  [FETCH_ZHIMA_SUCCESS]: (state, action) => {
    const token = action.payload.access_token
    const refreshToken = action.payload.refresh_token
    const newMember = action.payload.new_member
    cookie.save('token', token, { path: '/' })
    cookie.save('refreshToken', refreshToken, { path: '/' })
    cookie.save('newMember', newMember, { path: '/' })
    return ({ ...state, cookie: true, signed: true })
  },
  [FETCH_ZHIMA_FAILURE]: (state, action) => {
    return ({ ...state, error: action.payload, cookie: false, signed: false })
  }
}

// Reducers
const initialState = { error: {}, signed: false, cookie: false }
export default function userReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
