import * as types from './actionTypes';
import Songkick from 'songkick-api';
import Underscore from 'underscore'
import SpotifyWebApi from 'spotify-web-api-js';
import {setLoading} from './authActions.js'
import {setLoadingMessage} from './userActions.js'
const kick = new Songkick('C8TJ7xmSqeYneurG');
const spotifyApi = new SpotifyWebApi();


export function getConcerts(page, loc?) {
  console.log('getting concerts')
  return (dispatch, getState) => {
      let start = getState().concerts.startDate.format("YYYY-MM-DD")
      let end = getState().concerts.endDate.format("YYYY-MM-DD")
      dispatch(setLoading(true))
      let concertQuery = {'min_date': start, 'max_date' : end, 'per_page' : 20, 'page' : page}
      if(page == 1) {
        //need to grab the location either from the search or user's location
        //defaults to Washington, DC
        let data = {}
        if(loc) {
          data['query'] = loc
        } else {
          let coords = getState().location.coords
          data['location'] = 'geo:'+coords[0]+','+coords[1]
        }
        kick.searchLocations(data).then(resp => {
          if(resp) {
            let name = resp[0]['metroArea']['displayName'] + ', ' + resp[0]['metroArea']['state']['displayName']
            let id = resp[0]['metroArea']['id']
            dispatch(setLocation(name, id))
            kick.getMetroAreaCalendar(id, concertQuery).then(events => {
              dispatch(setNoResults(false))
              dispatch(formatConcerts(events))
              dispatch(increasePage(page+1))
            }).catch(err => {
              console.log(err)
            })
          } else {
            //location search yielded no results
            dispatch(setNoResults(true))
            dispatch(setLoading(false))
          }
        })
      } else {
        //don't need to set the location, already set
        dispatch(setLoadingMessage('One Sec'))
        let id = getState().location.id
        kick.getMetroAreaCalendar(id, concertQuery).then(events => {
          dispatch(formatConcerts(events))
          dispatch(increasePage(page+1))
        })
      }
  };
}

export function setNoResults(result) {
  return {type: types.SET_NO_RESULTS, results: result}
}

export function setLocation(name, id){
  return {type: types.SET_LOCATION, name: name, id: id}
}

export function increasePage(page) {
  return {type: types.UP_PAGE, page: page};
}

export function setStart(start) {
  return {type: types.CHANGE_START_DATE, start: start}
}

export function setEnd(end) {
  return {type: types.CHANGE_END_DATE, end: end}
}

export function formatConcerts(events) {
  let concerts = []
  return dispatch => {
    events.forEach(e => {
      if(e.displayName.indexOf('PRIVATE') == -1 && e.displayName.indexOf('CANCELLED') == -1 && e.popularity < 0.05){
        // take out any concerts with the same exact display name
        let exists = concerts.filter(concert => (concert.displayName === e.displayName));
        if(exists.length == 0){
          let artists = e.performance.map(e => e.artist)
          // dispatch(setLoadingMessage(artists[0]['displayName']))
          concerts.push({
            'displayName' : e.displayName,
            'artists' : artists,
            'start': e.start,
            'venue' : e.venue.displayName,
            'pop' : e.popularity,
            'url' : e.uri,
            'id' : e.id
          })
        }
      }
    })
    dispatch(getTracks(concerts))
  }
}

function getTracks(concerts) {
  // let validConcerts = []
  return (dispatch) => {
    //to move to the next function after the foreach functions are complete
    let all = 0;
    concerts.forEach(c => {
      all += c['artists'].length
    })
    let count = 0;
    concerts.forEach(c => {
      c['verifiedArtists'] = []
      c['artists'].forEach(a => {
        let validArtist = {}
        validArtist['tracks'] = []
        //iterate through all artists in a concert venue
        spotifyApi.searchArtists(a['displayName']).then(val => {
          count++
          if (val && val.artists.items.length > 0){
              let currArtist = null;
              let i = 0;
              //make sure the artist returned by spotify actually matches the artist name
              while (currArtist == null && i < val.artists.items.length) {
                if(val.artists.items[i]['name'] == a['displayName']) {
                  currArtist = val.artists.items[i]
                }
                i++
              }
              //setting up values to use from spotify for displaying the artist and getting tracks
              if(currArtist) {
                validArtist['spotifyId'] = currArtist['id']
                validArtist['genres'] = currArtist['genres']
                if(currArtist['images'].length > 0){
                  validArtist['image'] = currArtist['images'][0]['url']
                }
                //only showing verified artists from now on
                c['verifiedArtists'].push({...validArtist, ...a})
                }
              }
          if(count == all) {
            dispatch(getVerifiedTracks(concerts))
          }
        })
      })
    })
  }
}

export function getVerifiedTracks(unfilteredConcerts) {
  let concerts = unfilteredConcerts.filter(c =>
    c['verifiedArtists'].length > 0
  )
  let all = 0;
  concerts.forEach(c => {
    all += c['verifiedArtists'].length
  })
  let count = 0;
  return dispatch => {
    concerts.forEach(c => {
      c['artists'] = c['verifiedArtists']
      c['artists'].forEach(a => {
          spotifyApi.getArtistTopTracks(a['spotifyId'], 'from_token').then(result => {
            count++
            let tracks = result.tracks.slice(0,3)
            a['tracks'] = tracks
            if(all == count) {
                dispatch(getMatch(concerts))
            }
          })
      })
    })
  }
}

function checkIfValExists(id, arr){
  return arr.indexOf(id) != -1
}

export function getMatch(concerts) {
  let all = 0;
  concerts.forEach(c => {
    all += c['artists'].length
  })
  let count = 0;
  return (dispatch, getState) => {
    let genreMatrix = getState().user.genreMatrix;
    let genreCount = getState().user.genreCount;
    let artists = getState().user.artists;
    concerts.forEach(c => {
      c['artists'].forEach(a => {
        a['match'] = 0
        a['userArtists'] = []
        a['userGenres'] = []
          if(checkIfValExists(a['spotifyId'], artists)) {
            //user has artist saved in their library
            a['match'] = 1
            count++
            a['userArtists'].push(a['displayName'])
            if(count == all) {
              dispatch(addConcerts(concerts))
            }
          }  else {
              if(a['genres'].length > 0) {
                  //checking if this artist's genre exists in user's library
                  a['genres'].forEach(ag => {
                    if(genreMatrix.hasOwnProperty(ag)){
                      a['match'] += (genreMatrix[ag] / genreCount)
                      a['userGenres'].push(ag)
                    }
                  })
                  //getting the related artists to compare
                  spotifyApi.getArtistRelatedArtists(a['spotifyId']).then(related => {
                    related.artists.forEach(r => {
                      if(checkIfValExists(r['id'], artists)) {
                        console.log(r)
                        a['userArtists'].push(r['name'])
                        a['match']+= .05
                      }
                    })
                    count++
                    if(count == all) {
                      console.log('adding concerts nested')
                      dispatch(addConcerts(concerts))
                    }
                  })
                } else {
                  count++
                  if(count == all) {
                    console.log('adding concerts')
                    dispatch(addConcerts(concerts))
                  }
                }
        }
      })
    })
  }
}


export function playSong(deviceId, trackId, songUri, songName, curr, playing) {
    return dispatch => {
    spotifyApi.transferMyPlayback([deviceId]).then(val => {
      spotifyApi.containsMySavedTracks([trackId]).then(val => {
        if(val[0]) {
          dispatch({type: types.ADD_TO_LIBRARY, song: trackId})
        }
      })
      if(curr == songUri) {
        if(playing) {
          let data = {'device_id' : deviceId, 'uris' : [songUri]}
          spotifyApi.pause().then(resp => {
          }).catch(err => {
            console.log(err)
          })
          dispatch({type: types.PAUSE_SONG})
        } else {
          dispatch({type: types.PLAY_SONG})
          spotifyApi.play().then(resp => {
          }).catch(err => {
            console.log(err)
          })
        }
      } else {
        let data = {'device_id' : deviceId, 'uris' : [songUri]}
        spotifyApi.play(data).then(resp => {
        }).catch(err => {
          console.log(err)
        })
          dispatch({type: types.NOW_PLAYING, song: songUri, name: songName, trackId: trackId })
          dispatch({type: types.PLAY_SONG})
        }
    })
    }

}

export function showSearch() {
  return dispatch => {
    dispatch({type: types.SHOW_SEARCH})
  }
}

export function updateLoc(loc) {
  return dispatch => {
    dispatch({type: types.UPDATE_LOC, loc: loc})
  }
}

export function addConcerts(concerts) {
  console.log('adding concerts secondary')
  return dispatch => {
    dispatch({type: types.ADD_CONCERTS, concerts: concerts});
    dispatch(setLoading(false))
  }
}
