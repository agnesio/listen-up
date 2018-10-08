import initialState from './initialState';
import * as types from '../actions/actionTypes'


export default function login(state={loggedIn: false, token: '', loading: false}, action) {
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
    case types.SET_LOADING:
      return Object.assign({}, state, {
        loading: action.status
      })
    default:
      return state
  }
}
