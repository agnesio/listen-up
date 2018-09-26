import initialState from './initialState';
import * as types from '../actions/actionTypes'


export default function login(state={loggedIn: false, token: ''}, action) {
  switch(action.type){
    case types.LOGIN:
      console.log(action.token)
      return Object.assign({}, state, {
        loggedIn : true,
        token: action.token
      })
    case types.LOGOUT:
      return Object.assign({}, state, {
        loggedIn: false,
        token: ''
      })
    default:
      return state
  }
}
