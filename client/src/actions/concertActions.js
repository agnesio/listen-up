import * as types from './actionTypes';
import Songkick from 'songkick-api';
import SpotifyWebApi from 'spotify-web-api-js';
import {setLoading} from './authActions.js'
const kick = new Songkick('C8TJ7xmSqeYneurG');
const spotifyApi = new SpotifyWebApi();


export function getConcerts() {
  return dispatch => {
    kick.searchLocations({'query': 'Washington, DC'}).then(resp => {
      let id = resp[0]['metroArea']['id']
      kick.getMetroAreaCalendar(id, {'per_page' : 20, 'page' : 1}).then(events => {
        console.log(events)
        dispatch(formatConcerts(events))
      })
    }).catch(err => {
      console.log(err)
    })
  };
}

export function formatConcerts(events) {
  let concerts = []
  events.forEach(e => {
    if(e.displayName.indexOf('PRIVATE') == -1 && e.displayName.indexOf('CANCELLED') == -1 && e.popularity < 0.01){
      let artists = e.performance.map(e => e.artist)
      concerts.push({
        'displayName' : e.displayName,
        'artists' : artists,
        'start': e.start,
        'venue' : e.venue.displayName,
        'pop' : e.popularity,
        'url' : e.uri
      })
      console.log(concerts)
    }
  })
  return dispatch => {
    dispatch(getMatch(concerts))
  }
}

function checkIfValExists(id, arr){
  return arr.indexOf(id) != -1
}

export function getMatch(concerts) {
  return (dispatch, getState) => {
    // getting the state data for a user's music preferences
    let genreMatrix = getState().user.genreMatrix;
    let genreCount = getState().user.genreCount;
    let artists = getState().user.artists;
    let lc = concerts.length - 1
    let last = concerts[lc]['artists'][concerts[lc]['artists'].length -1]['id']
    concerts.forEach(c => {
      c['artists'].forEach(a => {
        a['match'] = 0;
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
                spotifyApi.getArtistTopTracks(currArtist['id'], 'from_token').then(result => {
                  let tracks = result.tracks.slice(0,3)
                  let ind = c['artists'].indexOf(a)
                  c['artists'][ind]['tracks'] = tracks
                }).catch(err => {
                  console.log(err)
                })
                if(checkIfValExists(currArtist['id'], artists)) {
                  //user has artist saved in their library
                  a['match'] = 1
                  if(a['id'] == last) {
                    console.log('adding concerts')
                    dispatch(addConcerts(concerts))
                    dispatch(setLoading(false))
                  }
                } else {
                  //checking if this artist's genre exists in user's library
                  val.artists.items[0]['genres'].forEach(ag => {
                    if(genreMatrix.hasOwnProperty(ag)){
                      a['match'] += genreMatrix[ag] / genreCount
                      console.log(a['match'])
                      // a['match'] += 1
                      //getting the related artists to compare
                      spotifyApi.getArtistRelatedArtists(currArtist['id']).then(related => {
                        related.artists.forEach(r => {
                          checkIfValExists(r['id'], artists) && (
                            a['match']+= .02
                          )
                        })
                        if(a['id'] == last) {
                          console.log('adding concerts')
                          dispatch(addConcerts(concerts))
                          dispatch(setLoading(false))
                        }
                  })
                }
              })
              }
            } else {
              a['valid'] = false;
              if(a['id'] == last) {
                console.log('adding concerts')
                dispatch(addConcerts(concerts))
                dispatch(setLoading(false))
              }
            }
          } else {
            a['valid'] = false;
            if(a['id'] == last) {
              console.log('adding concerts')
              dispatch(addConcerts(concerts))
              dispatch(setLoading(false))
            }
          }
        })
      })
    })
  }
}


export function addConcerts(concerts) {
  return {type: types.ADD_CONCERTS, concerts: concerts};
}
