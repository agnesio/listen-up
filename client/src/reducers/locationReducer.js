import initialState from './initialState';
import * as types from '../actions/actionTypes'


export default function location(state=initialState.location, action) {
  switch(action.type){
    case types.SET_LOCATION:
      return Object.assign({}, state, {
        name: action.name
      })
    case types.SET_CURR_COORDS:
      return Object.assign({}, state, {
        coords: action.coords
      })
    default:
      return state
    }
}
