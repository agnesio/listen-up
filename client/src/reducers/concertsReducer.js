import initialState from './initialState';
import * as types from '../actions/actionTypes'

export default function concerts(state = initialState.concerts, action) {
  switch (action.type) {
    case types.ADD_CONCERTS:
      return Object.assign({}, state, {
        concerts: action.concerts[0]
      })
    default:
      return state;
  }
}
