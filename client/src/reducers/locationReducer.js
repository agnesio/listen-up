import initialState from './initialState';
import * as types from '../actions/actionTypes'


export default function location(state=initialState.location, action) {
  switch(action.type){
    case types.SET_LOCATION:
      return Object.assign({}, state, {
        name: action.name,
        id: action.id
      })
    case types.SET_CURR_COORDS:
      return Object.assign({}, state, {
        coords: action.coords
      })
    case types.UPDATE_LOC:
      return Object.assign({}, state, {
        search: action.loc
      })
    default:
      return state
    }
}
