import * as types from './actionTypes';
import SpotifyWebApi from 'spotify-web-api-js';
import { getAnalytics } from './userActions'
import axios from 'axios'
const spotifyApi = new SpotifyWebApi();

export function setLoggedIn(token) {
  return {type: types.LOGIN, token: token};
}

export function setLogOut() {
  return {type: types.LOGOUT};
}


export function login() {
    console.log('loggin in')
    // let playerCheckInterval = null;
    const params = getHashParams();
    const token = params.access_token;
    console.log(params)
    if (token) {
      console.log(token)
      spotifyApi.setAccessToken(token);
      return dispatch => {
        dispatch(setLoggedIn(token))
        dispatch(getAnalytics())
      }
      // this.playerCheckInterval = setInterval(() => this.checkForPlayer(token), 1000);
      // this.checkForPlayer(token)
    } else {
      return dispatch => {
        dispatch(setLogOut())
      }
    }
}

// getting the parameters sent from oAuth in server
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  e = r.exec(q)
  while (e) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
     e = r.exec(q);
  }
  return hashParams;
}
//
// checkForPlayer(token) {
//   if (window.Spotify) {
//     clearInterval(this.playerCheckInterval);
//     this.player = new window.Spotify.Player({
//       name: "Agnes Spotify Player",
//       getOAuthToken: cb => { cb(token); },
//     });
//     this.createEventHandlers();
//
//     // finally, connect!
//     this.player.connect();
//   }
// }
//
// createEventHandlers() {
//   this.player.on('initialization_error', e => { console.error(e); });
//   this.player.on('authentication_error', e => {
//     console.error(e);
//   });
//   this.player.on('account_error', e => { console.error(e); });
//   this.player.on('playback_error', e => { console.error(e); });
//
//   // Playback status updates
//   this.player.on('player_state_changed', state => this.onStateChanged(state));
//
//   // Ready
//   this.player.on('ready', async data => {
//     let { device_id } = data;
//     await this.setState({ deviceId: device_id });
//     this.transferPlaybackHere();
//   });
// }
