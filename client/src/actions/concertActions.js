import * as types from './actionTypes';
import Songkick from 'songkick-api';
import SpotifyWebApi from 'spotify-web-api-js';
import {setLoading} from './authActions.js'
const kick = new Songkick('C8TJ7xmSqeYneurG');
const spotifyApi = new SpotifyWebApi();


export function getConcerts(page) {
  console.log('gettingConcerts')
  console.log(page)
  return dispatch => {
    let savedConcerts = localStorage.getItem('concertsRaw')
    // if(page == 1 && savedConcerts){
    //   dispatch(formatConcerts(JSON.parse(savedConcerts)))
    //   dispatch(increasePage(page+1))
    // } else  {
      kick.searchLocations({'query': 'Washington, DC'}).then(resp => {
        let id = resp[0]['metroArea']['id']
        kick.getMetroAreaCalendar(id, {'per_page' : 10, 'page' : page}).then(events => {
          if(page == 1) {
            localStorage.setItem('concertsRaw', JSON.stringify(events))
          }
          dispatch(formatConcerts(events))
          dispatch(increasePage(page+1))
        })
      }).catch(err => {
        console.log(err)
      })
    // }
  };
}

export function increasePage(page) {
  return {type: types.UP_PAGE, page: page};
}

export function formatConcerts(events) {
  console.log('formatting concerts')
  let concerts = []
  events.forEach(e => {
    if(e.displayName.indexOf('PRIVATE') == -1 && e.displayName.indexOf('CANCELLED') == -1 && e.popularity < 0.05){
      let artists = e.performance.map(e => e.artist)
      concerts.push({
        'displayName' : e.displayName,
        'artists' : artists,
        'start': e.start,
        'venue' : e.venue.displayName,
        'pop' : e.popularity,
        'url' : e.uri
      })
    }
  })
  return dispatch => {
    dispatch(getTracks(concerts))
  }
}

function getTracks(concerts) {
  console.log('getting tracks')
  return (dispatch) => {
    //to move to the next funciton after the foreach functions are complete
    let lc = concerts.length - 1
    let last = concerts[lc]['artists'][concerts[lc]['artists'].length -1]['id']
    concerts.forEach(c => {
      c['valid'] = false;
      c['artists'].forEach(a => {
        a['tracks'] = []
        //iterate through all artists in a concert venue
        spotifyApi.searchArtists(a['displayName']).then(val => {
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
              if(currArtist) {
                a['valid'] = true;
                c['valid']=true;
                a['spotifyId'] = currArtist['id']
                a['genres'] = currArtist['genres']
                if(currArtist['images'].length > 0){
                  a['image'] = currArtist['images'][0]['url']
                }
                spotifyApi.getArtistTopTracks(a['spotifyId'], 'from_token').then(result => {
                  let tracks = result.tracks.slice(0,3)
                  a['tracks'] = tracks
                  if(a['id'] == last) {
                    dispatch(getMatch(concerts, last))
                  }
                })
            } else {
              a['valid'] = false;
              if(a['id'] == last) {
                dispatch(getMatch(concerts, last))
              }
            }
          } else {
            a['valid'] = false;
            if(a['id'] == last) {
              dispatch(getMatch(concerts, last))
            }
          }
        })
      })
    })
  }
}

function checkIfValExists(id, arr){
  return arr.indexOf(id) != -1
}

export function getMatch(concerts, last) {
  return (dispatch, getState) => {
    let genreMatrix = getState().user.genreMatrix;
    let genreCount = getState().user.genreCount;
    let artists = getState().user.artists;
    concerts.forEach(c => {
      c['artists'].forEach(a => {
        a['match'] = 0
        if(a['valid']) {
          if(checkIfValExists(a['spotifyId'], artists)) {
            //user has artist saved in their library
            a['match'] = 1
            if(a['id'] == last) {
              dispatch(addConcerts(concerts))
            }
          } else {
              if(a['genres'].length > 0) {
                //checking if this artist's genre exists in user's library
                a['genres'].forEach(ag => {
                  if(genreMatrix.hasOwnProperty(ag)){
                    a['match'] += genreMatrix[ag] / genreCount
                    //getting the related artists to compare
                    spotifyApi.getArtistRelatedArtists(a['spotifyId']).then(related => {
                      related.artists.forEach(r => {
                        checkIfValExists(r['id'], artists) && (
                          a['match']+= .02
                        )
                        if(a['id'] == last && a['genres'].indexOf(ag) == a['genres'].length - 1) {
                          console.log('adding concerts')
                          dispatch(addConcerts(concerts))
                        }
                      })
                    })
                  } else {
                    if(a['id'] == last && a['genres'].indexOf(ag) == a['genres'].length - 1) {
                      console.log('adding concerts')
                      dispatch(addConcerts(concerts))
                    }
                  }
                })
              } else {
                if(a['id'] == last) {
                  console.log('adding concerts')
                  dispatch(addConcerts(concerts))
                }
              }
          }
        } else {
          if(a['id'] == last) {
            console.log('adding concerts')
            dispatch(addConcerts(concerts))
          }
        }
      })
    })
  }
}


export function playSong(deviceId, song, curr, playing) {
    return dispatch => {
    if(curr == song) {
      if(playing) {
        let data = {'device_id' : deviceId, 'uris' : [song]}
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
      let data = {'device_id' : deviceId, 'uris' : [song]}
      spotifyApi.play(data).then(resp => {
      }).catch(err => {
        console.log(err)
      })
        dispatch({type: types.NOW_PLAYING, song: song})
        dispatch({type: types.PLAY_SONG})
      }
    }

}


export function addConcerts(concerts) {
  return dispatch => {
    dispatch({type: types.ADD_CONCERTS, concerts: concerts});
    dispatch(setLoading(false))
  }
}
