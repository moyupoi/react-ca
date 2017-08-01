import { CALL_API } from 'redux-api-middleware'

import config from 'config'

// Constants
export const SET_TITLE = 'SET_TITLE'

export const WECHAT_REQUEST = 'WECHAT_REQUEST'
export const WECHAT_SUCCESS = 'WECHAT_SUCCESS'
export const WECHAT_FAILURE = 'WECHAT_FAILURE'

// Actions
export function setTitle (value = '') {
  return {
    type: SET_TITLE,
    value
  }
}

export function wechat (url) {
  return {
    [CALL_API]: {
      endpoint: config.api_root_v1 + '/wx?url=' + url,
      method: 'GET',
      headers: config.headers,
      types: [
        WECHAT_REQUEST,
        {
          type: WECHAT_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        WECHAT_FAILURE
      ]
    }
  }
}

export const actions = {
  setTitle,
  wechat
}

// Action Handlers
const ACTION_HANDLERS = {
  [SET_TITLE]: (state, action) => {
    return ({ ...state, title: { name: action.value } })
  },
  [WECHAT_REQUEST]: (state, action) => {
    return ({ ...state, wechat: { isFetching: true, info: '' } })
  },
  [WECHAT_SUCCESS]: (state, action) => {
    return ({ ...state, wechat: { isFetching: false, info: action.payload } })
  },
  [WECHAT_FAILURE]: (state, action) => {
    return ({ ...state, wechat: { isFetching: false } })
  }
}

// Reducers
const initialState = { title: { name: '住百家' }, wechat: { isFetching: false, info: '' } }
export default function commonReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
