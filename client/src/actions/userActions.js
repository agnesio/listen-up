import * as types from './actionTypes';
import SpotifyWebApi from 'spotify-web-api-js';
import { getConcerts } from './concertActions'
import axios from 'axios'
const spotifyApi = new SpotifyWebApi();

export function getAnalytics(pop?, total?, offset?, artistsArray?) {
  return dispatch => {
  let cachedArtists = JSON.parse(localStorage.getItem('artists'))
  // if(cachedArtists){
  //   dispatch(setArtists(cachedArtists))
  //   dispatch(getGenreMatrix(cachedArtists))
  // } else {
    let popularity = pop ? pop : 0;
    let count = total ? total : 0;
    let off = offset ? offset : 0;
    let artists = artistsArray  ? artistsArray : [];
    if(off == 0) {
      console.log('offset is 0')
      let recentArtists = []
      spotifyApi.getMyRecentlyPlayedTracks().then(response => {
        response.items.forEach(i => {
          i.track.artists.forEach(a => {
            console.log(a)
            recentArtists = recentArtists.concat(a.id)
          })
        })
          dispatch(setRecentArtists(recentArtists))
          dispatch(getGenreMatrix(recentArtists, 'recent'))
      })
    }
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
          localStorage.setItem('artists', JSON.stringify(artists))
          dispatch(setHipster(hipster))
          dispatch(setArtists(artists))
          dispatch(getGenreMatrix(artists, 'all'))
      }
    }).catch(err => {
      console.log(err)
    })
  // }
  }
}

export function getUserInfo(){
  return dispatch => {
    spotifyApi.getMe().then(resp => {
      console.log(resp)
      let fName = resp.display_name.split(" ")
      fName = fName[0]
      dispatch({type: types.SET_USER_INFO, email: resp.email, pic: resp.images[0]['url'], name: fName})
    })
  }
}

export function setRecentArtists(a) {
  console.log(a)
  return {type: types.RECENT_ARTISTS, recentArtists: a}
}


export function getGenreMatrix(artists, type, offset?, genres?) {
  return dispatch => {
    if(type == 'recent') {
      console.log('recent artists')
      console.log(artists)
    }
    let off = offset ? offset : 0;
    let genreMatrix = genres ? genres : [];
    let artistArray = type == 'recent' ? artists : artists.slice(off, off+49)
    if(artistArray.length > 0) {
      spotifyApi.getArtists(artistArray).then(val => {
        val.artists.forEach(a => {
          a.genres.forEach(g => {
            genreMatrix = genreMatrix.concat(g)
          })
        })
          if(artists.length > off+49 && type != 'recent'){
            dispatch(getGenreMatrix(artists, 'all', off+49, genreMatrix))
          } else  {
            dispatch(processGenres(genreMatrix, type))
          }
      }).catch(err => {
        console.log(err)
      })
    } else {
        dispatch(processGenres(genreMatrix, type))
    }
  }
}

export function processGenres(genres, type){
  console.log('the type is ' + type)
    return dispatch => {
      let genreMatrix = []
      let a = [];
      //iterating through the genres to keep a count of every genre
      genres.forEach(g => {
        let index = a.indexOf(g)
        if(index == -1){
          a.push(g);
          genreMatrix[g] = 1
        } else {
          genreMatrix[g] = genreMatrix[g]+1
        }
      })
        localStorage.setItem('genres', JSON.stringify(genreMatrix))
        localStorage.setItem('genreCount', JSON.stringify(genres.length))
        dispatch(setGenres(genreMatrix, genres.length, type))
        type == 'all' && (dispatch(getConcerts(1)))
  }
}

export function setGenres(genreMatrix, genreCount, type) {
  let actionType = types.SET_GENRES;
  if(type == 'recent') {
    actionType = types.RECENT_GENRES
  }
  return {type: actionType, genreMatrix: genreMatrix, genreCount: genreCount}
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

export function setEmail(email) {
  return {type: types.UPDATE_EMAIL, email: email};
}

export function setFeedback(feedback) {
    return {type: types.UPDATE_FEEDBACK, feedback: feedback};
}

export function mailingList(type, email) {
  return dispatch => {
    let url = 'https://rfvslvf9nk.execute-api.us-east-1.amazonaws.com/dev/setSpotifyMailList'
    let data = {'type' : type, 'email' : email}
    axios.post(url, data).then(val => {
      dispatch({type: types.SUBMIT_MAILING, mailType: type})
    }).catch(err => [
      console.log(err)
    ])
  }
}

export function feedback(type, email, message) {
  return dispatch => {
    let url = 'https://rfvslvf9nk.execute-api.us-east-1.amazonaws.com/dev/setSpotifyFeedback'
    let data = {'type' : type, 'email' : email, 'message' : message}
    axios.post(url, data).then(val => {
      dispatch({type: types.SUBMIT_FEEDBACK, feedbackType: type})
    })
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

export function toggleNav(isOpen) {
  return {type: types.TOGGLE_NAV, isOpen: isOpen}
}

export function addToLibrary(id, index) {
  return dispatch => {
    if(index == -1) {
      spotifyApi.addToMySavedTracks([id]).then(resp => {
        dispatch({type: types.ADD_TO_LIBRARY, song: id})
      })
    } else {
      return null
    }
  }
}
