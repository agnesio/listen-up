import initialState from './initialState';
import * as types from '../actions/actionTypes'

export default function concerts(state = initialState.concerts, action) {
  switch (action.type) {
    case types.ADD_CONCERTS:
      return {...state,
        concerts: state.concerts.concat(action.concerts)
      }
    case types.UP_PAGE:
      return Object.assign({}, state, {
        page: action.page
      })
    default:
      return state;
  }
}
