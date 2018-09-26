import * as types from './actionTypes';
import Songkick from 'songkick-api';
import SpotifyWebApi from 'spotify-web-api-js';
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
    }
  })
  return dispatch => {
    dispatch(getArtistTracks(concerts))
  }
}

export function getArtistTracks(concerts) {
  return dispatch => {
  concerts.forEach(c => {
    c['artists'].forEach(a => {
      spotifyApi.searchArtists(a['displayName']).then(val => {
        if (val && val.artists.items.length > 0){
            // let match = 0
            // if(this.state.artists.indexOf(val.artists.items[0]['id']) != -1) {
            //   match = 100
            // } else {
            //   val.artists.items[0]['genres'].forEach(ag => {
            //     if(this.state.genreMatrix.hasOwnProperty(ag)){
            //       match += (this.state.genreMatrix[ag] / this.state.genreCount)
            //     }
            //   })
            //   match = match * 150
            // }
            // a['match'] = match.toFixed(2)
            spotifyApi.getArtistTopTracks(val.artists.items[0]['id'], 'from_token').then(result => {
              let ind = c['artists'].indexOf(a)
              c['artists'][ind]['tracks'] = result.tracks.slice(0,3)
              if(concerts.indexOf(c) == concerts.length - 1){
                dispatch(addConcerts(concerts))
              }
            }).catch(err => {
              console.log(err)
            })
        }
      })
    })
  })
}
}

export function addConcerts(concerts) {
  return {type: types.ADD_CONCERTS, concerts: concerts};
}
