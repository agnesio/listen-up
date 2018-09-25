import React, { Component } from 'react';
import logo from './logo.svg';
import SpotifyWebApi from 'spotify-web-api-js';
import './App.css';
import {RadarChart, Radar, PolarRadiusAxis, PolarAngleAxis, PolarGrid} from 'recharts';
import Songkick from 'songkick-api';
const spotifyApi = new SpotifyWebApi();
const kick = new Songkick('C8TJ7xmSqeYneurG');


class App extends Component {
  constructor(){
    super();
    this.playerCheckInterval = null;
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(token), 1000);
      this.checkForPlayer(token)
      this.getStatus()
    }
    this.state = {
      loggedIn: token ? true : false,
      data: [],
      token: token,
      hipster: 0,
      artists: [],
      offset: 0,
      concerts: [],
      error: "",
      trackName: "Track Name",
      artistName: "Artist Name",
      albumName: "Album Name",
      playing: false,
      position: 0,
      duration: 0,
      deviceId: "",
      loading: true,
      genreMatrix: [],
      genreCount: 0,
      page: 1
    }
  }

  // getting the parameters sent from oAuth in server
  getHashParams() {
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

  checkForPlayer(token) {
    if (window.Spotify) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "Agnes Spotify Player",
        getOAuthToken: cb => { cb(token); },
      });
      this.createEventHandlers();

      // finally, connect!
      this.player.connect();
    }
  }

  createEventHandlers() {
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });

    // Playback status updates
    this.player.on('player_state_changed', state => this.onStateChanged(state));

    // Ready
    this.player.on('ready', async data => {
      let { device_id } = data;
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere();
    });
  }

  getLoc(){
    kick.searchLocations({'query': 'Washington, DC'}).then(resp => {
      let id = resp[0]['metroArea']['id']
      kick.getMetroAreaCalendar(id, {'per_page' : 20, 'page' : this.state.page}).then(events => {
        let curr = this.state.page += 1
        this.setState({
          page: curr
        })
        console.log(this.state.page)
        this.formatConcerts(events)
      })
    }).catch(err => {
      console.log(err)
    })
  }

  formatConcerts(events) {
    let concerts = []
    events.forEach(e => {
      if(e.displayName.indexOf('PRIVATE') == -1 && e.displayName.indexOf('CANCELLED') == -1 && e.popularity < 0.01){
        let artists = e.performance.map(e => e.artist)
        concerts.push({
          'displayName' : e.displayName,
          'artists' : artists,
          'start': e.start,
          'venue' : e.venue.displayName,
          'tracks' : [],
          'pop' : e.popularity
        })
      }
    })
    this.getArtistTracks(concerts)
  }

  getArtistTracks(concerts) {
    concerts.forEach(c => {
      c['artists'].forEach(a => {
        spotifyApi.searchArtists(a['displayName']).then(val => {
          if (val && val.artists.items.length > 0){
              let match = 0
              if(this.state.artists.indexOf(val.artists.items[0]['id']) != -1) {
                match = 100
              } else {
                val.artists.items[0]['genres'].forEach(ag => {
                  if(this.state.genreMatrix.hasOwnProperty(ag)){
                    match += (this.state.genreMatrix[ag] / this.state.genreCount)
                  }
                })
                match = match * 150
              }
              a['match'] = match.toFixed(2)
              spotifyApi.getArtistTopTracks(val.artists.items[0]['id'], 'from_token').then(result => {
                c['tracks'] = c['tracks'].concat(result.tracks.slice(0,3))
                if(concerts.indexOf(c) == concerts.length - 1){
                  concerts.concat(this.state.concerts)
                  this.setState({
                    'concerts' : concerts,
                    'loading' : false,
                  })
                }
              }).catch(err => {
                console.log(err)
              })
          }
        })
      })
    })
  }


  onStateChanged(state) {
    // if we're no longer listening to music, we'll get a null state.
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration,
      } = state.track_window;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const playing = !state.paused;
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing
      });
    }
  }

  onPrevClick() {
    this.player.previousTrack();
  }

  onPlayClick() {
    this.player.togglePlay();
  }

  onNextClick() {
    this.player.nextTrack();
  }

  playSong(song) {
    let data = {'device_id' : [this.state.deviceId], 'uris' : [song]}
    spotifyApi.play(data).then(resp => {
    }).catch(err => {
      console.log(err)
    })
  }

  transferPlaybackHere() {
    console.log('transferring playback')
    const { deviceId, token } = this.state;
    spotifyApi.transferMyPlayback([deviceId]).then(val => {
      console.log(val)
    })
  }

  getStatus(pop?, total?, offset?, artistsArray?){
    let popularity = pop ? pop : 0;
    let count = total ? total : 0;
    let off = offset ? offset : 0;
    let artists = artistsArray  ? artistsArray : [];
    spotifyApi.getMySavedTracks(off).then((response) => {
      response.items.forEach(i => {
        popularity += i.track.popularity;
        i.track.artists.forEach(a => {
          artists = artists.concat(a.id)
        })
      })
      count += response.items.length;
    if(response.next) {
        off += 50;
        this.getStatus(popularity, count, off, artists)
    } else {
        let hipster = (popularity / count).toFixed(2)
        this.setState({
          hipster : hipster,
          artists: artists
        })
        this.getGenreMatrix(artists)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  getGenreMatrix(artists, offset?, genres){
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
        this.getGenreMatrix(artists, off+49, genreMatrix)
      } else {
        this.processGenres(genreMatrix)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  processGenres(genres){
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
    this.setState({
      'genreMatrix' : genreMatrix,
      'genreCount' : genres.length
    })
    console.log(genreMatrix)
    this.getLoc()
  }


  render() {
    return (
      <div className='App'>
          <a href='http://localhost:8888'> Login to Spotify </a>
        {this.state.hipster != 0 &&
          <div>
            <h1>
              {(100 - this.state.hipster) +'% Hipster'}
            </h1>
            <h2>
            {this.state.hipster > 80 ? 'Absolutely not hipster' :
              this.state.hipster > 65 ? "Eh you're not totally mainstream" :
                this.state.hipster > 50 ? "You know some hidden tracks" :
                  this.state.hipster > 40 ? "People go to you for music" :
                    this.state.hipster > 30 ? "You even know the underground scene" :
                      this.state.hipster > 20 ? "Do people ever know what you're listening to?" :
                      "Certified hipster"}
            </h2>
          </div>
        }
        { this.state.loggedIn &&
          <div>
            <div>
              <p>Artist: {this.state.artistName}</p>
              <p>Track: {this.state.trackName}</p>
              <p>Album: {this.state.albumName}</p>
              <p>
              <button onClick={() => this.onPrevClick()}>Previous</button>
              <button onClick={() => this.onPlayClick()}>{this.state.playing ? "Pause" : "Play"}</button>
              <button onClick={() => this.onNextClick()}>Next</button>
              </p>
            </div>
          </div>
        }
        { this.state.loading == false &&
            (this.state.concerts.map(c =>
              <div className="concerts">
                <h2>{c.displayName}</h2>
                <h3>{c.venue}</h3>
                <h3>{c.start['date']} {c.start['time']}</h3>
                <h4>{c.pop}</h4>
                <table>
                  {c.artists.map(a =>
                    <tr>
                      <td>{a.displayName}</td>
                      <td>{a.match}%</td>
                    </tr>
                  )}
                </table>
                <table>
                  {c.tracks.map(t =>
                    <tr>
                      <td><button onClick={() => this.playSong(t.uri)}> Play </button></td>
                      <td>{t.name}</td>
                      <td>
                        {t.artists
                        .map(artist => artist.name)
                        .join(", ")}
                      </td>
                    </tr>
                  )}
                </table>
              </div>
            ))
        }
      <button onClick={() => this.getLoc()}>Load More </button>
      </div>
    )
  }
}

export default App;
