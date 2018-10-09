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

export function setLoading(loading) {
  return {type: types.SET_LOADING, status: loading}
}

export function login() {
    // let playerCheckInterval = null;
    const params = getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
      return dispatch => {
        dispatch(setLoading(true))
        dispatch(setLoggedIn(token))
        dispatch(getAnalytics())
      }
    } else {
      return dispatch => {
        dispatch(setLogOut())
      }
    }
}

export function setDevice(deviceId) {
  return {type: types.SET_DEVICE, device: deviceId}
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
