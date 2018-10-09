import initialState from './initialState';
import * as types from '../actions/actionTypes'

export default function concerts(state = initialState.player, action) {
  switch (action.type) {
    case types.NOW_PLAYING:
      return Object.assign({}, state, {
        song: action.song
      })
    case types.PLAY_SONG:
      return Object.assign({}, state, {
        playing: true
      })
    case types.PAUSE_SONG:
      return Object.assign({}, state, {
        playing: false
      })
    default:
      return state;
  }
}
