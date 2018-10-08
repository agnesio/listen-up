import * as types from './actionTypes';
import SpotifyWebApi from 'spotify-web-api-js';
import { getConcerts } from './concertActions'
import axios from 'axios'
const spotifyApi = new SpotifyWebApi();

export function getAnalytics(pop?, total?, offset?, artistsArray?) {
  return dispatch => {
  let popularity = pop ? pop : 0;
  let count = total ? total : 0;
  let off = offset ? offset : 0;
  let artists = artistsArray  ? artistsArray : [];
  spotifyApi.getMySavedTracks(off).then((response) => {
    dispatch(setLoadingMessage(response.items[0].track.artists[0].name))
    response.items.forEach(i => {
      popularity += i.track.popularity;
      i.track.artists.forEach(a => {
        artists = artists.concat(a.id)
      })
    })
    count += response.items.length;
  if(response.next) {
      off += 50;
      dispatch(getAnalytics(popularity, count, off, artists))
  } else {
      let hipster = (popularity / count).toFixed(2)
        dispatch(setHipster(hipster))
        dispatch(setArtists(artists))
        dispatch(getGenreMatrix(artists))
    }
  }).catch(err => {
    console.log(err)
  })
  }
}


export function getGenreMatrix(artists, offset?, genres?) {
  return dispatch => {
  let off = offset ? offset : 0;
  let genreMatrix = genres ? genres : [];
  let artistArray = artists.slice(off, off+49)
  spotifyApi.getArtists(artistArray).then(val => {
    val.artists.forEach(a => {
      a.genres.forEach(g => {
        genreMatrix = genreMatrix.concat(g)
      })
    })
      if(artists.length > off+49){
        dispatch(getGenreMatrix(artists, off+49, genreMatrix))
      } else {
        dispatch(processGenres(genreMatrix))
      }
  }).catch(err => {
    console.log(err)
  })
}
}

export function processGenres(genres){
  let genreMatrix = []
  let a = [];
  genres.forEach(g => {
    let index = a.indexOf(g)
    if(index == -1){
      a.push(g);
      genreMatrix[g] = 1
    } else {
      genreMatrix[g] = genreMatrix[g]+1
    }
  })
  return dispatch => {
    dispatch(setGenres(genreMatrix, genres.length))
    dispatch(getConcerts())
  }
}

export function setGenres(genreMatrix, genreCount) {
  return {type: types.SET_GENRES, genreMatrix: genreMatrix, genreCount: genreCount}
}

export function setLoadingMessage(name){
  return {type: types.SET_LOADING_MESSAGE, name: name}
}

export function setHipster(rating){
  return {type: types.HIPSTER_RATING, rating:rating};
}

export function setArtists(artists){
  return {type: types.USER_ARTISTS, artists: artists}
}

export function updateEmail(email) {
  return {type: types.UPDATE_EMAIL, email: email};
}

export function submitEmail(email) {
return dispatch => {
  if(email.trim() != '') {
    console.log(email)
    let url = 'https://q0arp55edk.execute-api.us-east-1.amazonaws.com/dev/setEmailsForAreYouHipster'
    let data = {'email' : email, 'timestamp' : Date.now()}
    axios.post(url, data).then(val => {
      dispatch(changeEmailStatus())
    })
  }
  }
}

export function share(type) {
  return dispatch => {
    let url = 'https://q0arp55edk.execute-api.us-east-1.amazonaws.com/dev/setSocialAnalyticsForAreYouHipster'
    let data = {'type' : type}
    axios.post(url, data).then(val => {
      console.log(val)
    })
  }
}

export function changeEmailStatus() {
  console.log('change email')
  return {type: types.SUBMIT_EMAIL}
}

export function hideForm() {
  return {type: types.HIDE_FORM}
}

export function openBeta() {
  return dispatch => {
    let url = 'https://q0arp55edk.execute-api.us-east-1.amazonaws.com/dev/setSocialAnalyticsForAreYouHipster'
    let data = {'type' : 'beta'}
    axios.post(url, data).then(val => {
      dispatch(betaReadMore())
    })
  }
}

export function betaReadMore() {
  return {type: types.OPEN_BETA}
}
