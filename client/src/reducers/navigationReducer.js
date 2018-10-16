import initialState from './initialState';
import * as types from '../actions/actionTypes'


export default function nav(state = initialState.nav, action) {
  switch (action.type) {
    case types.TOGGLE_NAV:
    return Object.assign({}, state, {
      navOpen: action.isOpen
    })
    default:
      return state;
  }
}
