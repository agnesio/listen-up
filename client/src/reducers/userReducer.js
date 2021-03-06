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
    case types.RECENT_ARTISTS:
      return Object.assign({}, state, {
        recentArtists: action.recentArtists
      })
    case types.RECENT_GENRES:
      return Object.assign({}, state, {
        recentGenres: action.genreMatrix,
        recentGenreCount: action.genreCount
      })
    case types.SET_GENRES:
      return Object.assign({}, state, {
        genreMatrix: action.genreMatrix,
        genreCount: action.genreCount
      })
    case types.SET_LOADING_MESSAGE:
      return Object.assign({}, state, {
        loadingMessage: action.name
      })
    case types.UPDATE_EMAIL:
      return Object.assign({}, state, {
        formEmail: action.email
      })
    case types.UPDATE_FEEDBACK:
      return Object.assign({}, state, {
        feedback: action.feedback
      })
    case types.SUBMIT_EMAIL:
      return Object.assign({}, state, {
        submitting: true
      })
    case types.OPEN_BETA:
      return Object.assign({}, state, {
        betaOpen: true
      })
    case types.HIDE_FORM:
      return Object.assign({}, state, {
        submitted: true
      })
    case types.SET_USER_INFO:
      return Object.assign({}, state, {
        email: action.email,
        pic: action.pic,
        name: action.name
      })
    case types.ADD_TO_LIBRARY:
      return Object.assign({}, state, {
          addedSongs: [...state.addedSongs, action.song]
      })
    case types.SUBMIT_MAILING:
      return Object.assign({}, state, {
        mailingList: [...state.mailingList, action.mailType]
      })
    case types.SUBMIT_FEEDBACK:
      return Object.assign({}, state, {
        feedbackList: [...state.feedbackList, action.feedbackType]
      })
    default:
      return state
  }
}
