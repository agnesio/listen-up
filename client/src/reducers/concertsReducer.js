import initialState from './initialState';
import * as types from '../actions/actionTypes'

export default function concerts(state = initialState.concerts, action) {
  switch (action.type) {
    case types.ADD_CONCERTS:
    return Object.assign({}, state, {
      concerts: action.concerts
    })
    case types.UP_PAGE:
      return Object.assign({}, state, {
        page: action.page
      })
    case types.SHOW_SEARCH:
      return Object.assign({}, state, {
        search: true
      })
    case types.SET_NO_RESULTS:
      return Object.assign({}, state, {
        noResults: action.results
      })
    default:
      return state;
  }
}
