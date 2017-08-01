import { CALL_API } from 'redux-api-middleware'

import config from 'config'

export const FETCH_DESTINATIONS_REQUEST = 'FETCH_DESTINATIONS_REQUEST'
export const FETCH_DESTINATIONS_SUCCESS = 'FETCH_DESTINATIONS_SUCCESS'
export const FETCH_DESTINATIONS_FAILURE = 'FETCH_DESTINATIONS_FAILURE'

export const SEARCH_DESTINATIONS_REQUEST = 'SEARCH_DESTINATIONS_REQUEST'
export const SEARCH_DESTINATIONS_SUCCESS = 'SEARCH_DESTINATIONS_SUCCESS'
export const SEARCH_DESTINATIONS_FAILURE = 'SEARCH_DESTINATIONS_FAILURE'

export function fetchDestinations () {
  return {
    [CALL_API]: {
      endpoint: config.api_root_v1 + '/search/destinations',
      method: 'GET',
      headers: config.headers,
      types: [
        FETCH_DESTINATIONS_REQUEST,
        {
          type: FETCH_DESTINATIONS_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        FETCH_DESTINATIONS_FAILURE
      ]
    }
  }
}

export function searchDestinations (keyword) {
  return {
    [CALL_API]: {
      endpoint: config.api_root_v1 + '/search/complete?&q=' + keyword,
      method: 'GET',
      headers: config.headers,
      types: [
        SEARCH_DESTINATIONS_REQUEST,
        {
          type: SEARCH_DESTINATIONS_SUCCESS,
          payload: (action, state, res) => {
            return res.json()
          }
        },
        SEARCH_DESTINATIONS_FAILURE
      ]
    }
  }
}

// Action Handlers
const ACTION_HANDLERS = {
  [FETCH_DESTINATIONS_REQUEST]: (state, action) => {
    return ({ ...state, fetchValues: { error: {}, isFetching: true, items: [] } })
  },
  [FETCH_DESTINATIONS_SUCCESS]: (state, action) => {
    return ({ ...state, fetchValues: { error: {}, isFetching: false, items: action.payload } })
  },
  [FETCH_DESTINATIONS_FAILURE]: (state, action) => {
    return ({ ...state, fetchValues: { error: {}, isFetching: false } })
  },
  [SEARCH_DESTINATIONS_REQUEST]: (state, action) => {
    return ({ ...state, searchValues: { error: {}, isFetching: true, values: [] } })
  },
  [SEARCH_DESTINATIONS_SUCCESS]: (state, action) => {
    return ({ ...state, searchValues: { error: {}, isFetching: false, values: action.payload } })
  },
  [SEARCH_DESTINATIONS_FAILURE]: (state, action) => {
    return ({ ...state, searchValues: { error: {}, isFetching: false } })
  }
}

// Reducers
const initialState = { fetchValues: { isFetching: false, items: [], error: {} }, searchValues: { isFetching: false, values: [], error: {} } }
export default function destinationsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
