import initialState from './initialState';
import * as types from '../actions/actionTypes'


export default function hipsterRating(state=initialState.user, action) {
  switch(action.type){
    case types.HIPSTER_RATING:
      return Object.assign({}, state, {
        hipster: action.rating
      })
    case types.USER_ARTISTS:
      return Object.assign({}, state, {
        artists: action.artists
      })
    case types.SET_GENRES:
      return Object.assign({}, state, {
        genreMatrix: action.genreMatrix,
        genreCount: action.genreCount
      })
    default:
      return state
  }
}
