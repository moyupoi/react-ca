import { CALL_API } from 'redux-api-middleware'
import { extend } from 'lodash/fp'
import cookie from 'react-cookie'
import config from 'config'

// Constants
export const FETCH_ENTRANCE_REQUEST = 'FETCH_ENTRANCE_REQUEST'
export const FETCH_ENTRANCE_SUCCESS = 'FETCH_ENTRANCE_SUCCESS'
export const FETCH_ENTRANCE_FAILURE = 'FETCH_ENTRANCE_FAILURE'

export const FETCH_RECOMMONDED_OFFERS_REQUEST = 'FETCH_RECOMMONDED_OFFERS_REQUEST'
export const FETCH_RECOMMONDED_OFFERS_SUCCESS = 'FETCH_RECOMMONDED_OFFERS_SUCCESS'
export const FETCH_RECOMMONDED_OFFERS_FAILURE = 'FETCH_RECOMMONDED_OFFERS_FAILURE'
export const REGION_CHANGE = 'REGION_CHANGE'

export const FETCH_CONFDATA_REQUEST = 'FETCH_CONFDATA_REQUEST'
export const FETCH_CONFDATA_SUCCESS = 'FETCH_CONFDATA_SUCCESS'
export const FETCH_CONFDATA_FAILURE = 'FETCH_CONFDATA_FAILURE'

// Actions
export function fetchEntrance () {
  return {
    [CALL_API]: {
      endpoint: config.api_root_v2 + '/suggests/entrance',
      method: 'GET',
      headers: config.headers,
      types: [
        FETCH_ENTRANCE_REQUEST,
        {
          type: FETCH_ENTRANCE_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        FETCH_ENTRANCE_FAILURE
      ]
    }
  }
}

export function changeRegion (regionId) {
  return {
    type: REGION_CHANGE,
    regionId
  }
}

export function fetchRecommondedOffers (regionId = 2) {
  return {
    [CALL_API]: {
      endpoint: config.api_root_v1 + '/suggests/recommended_offers?region_id=' + regionId,
      method: 'GET',
      headers: config.headers,
      types: [
        FETCH_RECOMMONDED_OFFERS_REQUEST,
        {
          type: FETCH_RECOMMONDED_OFFERS_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        FETCH_RECOMMONDED_OFFERS_FAILURE
      ]
    }
  }
}

// 优惠券配置
export function fetchConfigureData () {
  const token = cookie.load('token')
  return {
    [CALL_API]: {
      endpoint: config.api_root_auth + '/configuration',
      method: 'GET',
      headers: extend(config.headers, { 'Authorization': `Bearer ${token}` }),
      types: [
        FETCH_CONFDATA_REQUEST,
        {
          type: FETCH_CONFDATA_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        FETCH_CONFDATA_FAILURE
      ]
    }
  }
}

export function fetchRecommondedOffersIfNeeded (regionId) {
  return (dispatch, getState) => {
    return dispatch(fetchRecommondedOffers(regionId))
  }
}

export const actions = {
  changeRegion,
  fetchEntrance,
  fetchRecommondedOffers,
  fetchRecommondedOffersIfNeeded
}

// Action Handlers
const ACTION_HANDLERS = {
  [FETCH_ENTRANCE_REQUEST]: (state, action) => {
    return ({ ...state, entrance: { isFetching: true, error: {}, items: [] } })
  },
  [FETCH_ENTRANCE_SUCCESS]: (state, action) => {
    return ({ ...state, entrance: { isFetching: false, lastUpdate: Date.now(), items: action.payload } })
  },
  [FETCH_ENTRANCE_FAILURE]: (state, action) => {
    return ({ ...state, entrance: { isFetching: false, error: {}, items: [] } })
  },
  [FETCH_RECOMMONDED_OFFERS_REQUEST]: (state, action) => {
    return ({ ...state, offers: { error: {}, isFetching: true, items: [], lastUpdate: Date.now() } })
  },
  [FETCH_RECOMMONDED_OFFERS_SUCCESS]: (state, action) => {
    return ({ ...state, offers: { error: {}, isFetching: false, items: action.payload, lastUpdate: Date.now() } })
  },
  [FETCH_RECOMMONDED_OFFERS_FAILURE]: (state, action) => {
    return ({ ...state, offers: { error: {}, isFetching: false } })
  },
  [REGION_CHANGE]: (state = 1, action) => {
    return ({ ...state, recommondedRegionId: action.regionId })
  },
  [FETCH_CONFDATA_REQUEST]: (state, action) => {
    return ({ ...state, configData: { error: {}, isFetching: true, items: [] } })
  },
  [FETCH_CONFDATA_SUCCESS]: (state, action) => {
    return ({ ...state, configData: { error: {}, isFetching: false, items: action.payload, lastUpdate: Date.now() } })
  },
  [FETCH_CONFDATA_FAILURE]: (state, action) => {
    return ({ ...state, configData: { error: {}, isFetching: false } })
  }
}

// Reducers
const initialState = { entrance: { isFetching: false, error: {}, items: [] }, offers: { isFetching: false, error: {}, items: [], lastUpdate: '' } }
export default function homeReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
