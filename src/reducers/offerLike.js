import { CALL_API } from 'redux-api-middleware'
import cookie from 'react-cookie'
import { extend } from 'lodash/fp'

import config from 'config'
var thisOfferId

// Constants
export const OFFER_LIKE_REQUEST = 'OFFER_LIKE_REQUEST'
export const OFFER_LIKE_SUCCESS = 'OFFER_LIKE_SUCCESS'
export const OFFER_LIKE_FAILURE = 'OFFER_LIKE_FAILURE'

// Actions

export function offerChangeLike (offerId, likeable) {
  thisOfferId = offerId
  return {
    [CALL_API]: {
      endpoint: config.api_root_v1 + '/offers/' + offerId + '/' + likeable,
      method: 'POST',
      headers: extend(config.headers, { 'Authorization': `Bearer ${cookie.load('token')}` }),
      types: [
        OFFER_LIKE_REQUEST,
        OFFER_LIKE_SUCCESS,
        OFFER_LIKE_FAILURE
      ]
    }
  }
}

export const actions = {
  offerChangeLike
}

// Action Handlers
const ACTION_HANDLERS = {
  [OFFER_LIKE_REQUEST]: (state, action) => {
    return ({ ...state, isFetching: true, error: {} })
  },
  [OFFER_LIKE_SUCCESS]: (state, action) => {
    return ({ ...state, isFetching: false, error: {}, offerId: thisOfferId })
  },
  [OFFER_LIKE_FAILURE]: (state, action) => {
    return ({ ...state, isFetching: false, error: {} })
  }
}

// Reducers
const initialState = { isFetching: false, error: {} }
export default function offerLikeReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
