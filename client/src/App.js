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
    }
    this.state = {
      loggedIn: token ? true : false,
      data: [],
      token: token,
      hipster: 0,
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
      loading: true
    }
    this.getMood()

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
      console.log("Let the music play on!");
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere();
    });
  }

  getMood(){
    let currAnalysis = [];
    spotifyApi.getMyRecentlyPlayedTracks()
      .then((response) => {
          let ids = response.items.map(r => r.track.id)
          spotifyApi.getAudioFeaturesForTracks(ids).then((info) => {
            console.log(info)
            this.getAnalysis(info.audio_features)
          })
        })
    this.getLoc()
  }

  getLoc(){
    kick.searchLocations({'query': 'Washington, DC'}).then(resp => {
      let id = resp[0]['metroArea']['id']
      console.log(id)
      kick.getMetroAreaCalendar(id).then(events => {
        this.formatConcerts(events)
      })
    }).catch(err => {
      console.log(err)
    })
  }

  formatConcerts(events) {
    let concerts = [];
    events.forEach(e => {
      let artists = e.performance.map(e => e.displayName)
      concerts.push({
        'displayName' : e.displayName,
        'artists' : artists,
        'start': e.start,
        'venue' : e.venue.displayName,
        'tracks' : [],
        'pop' : e.popularity
      })
    })
    this.getArtistTracks(concerts)
  }

  getArtistTracks(concerts) {

    concerts.forEach(c => {
      c['artists'].forEach(a => {
        spotifyApi.searchArtists(a).then(val => {
          if (val && val.artists.items.length > 0){
            spotifyApi.getArtistTopTracks(val.artists.items[0]['id'], 'from_token').then(result => {
              c['tracks'] = c['tracks'].concat(result.tracks.slice(0,3))
              if(concerts.indexOf(c) == concerts.length - 1){
                this.setState({
                  'concerts' : concerts,
                  'loading' : false,
                })
                console.log(concerts)
              }
            })
          }
        })
      })
    })
    console.log(concerts)
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
      console.log(this.state)
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

  // getMatch(track) {
  //   let sum = 0;
  //   this.state.data.forEach(d => {
  //     // console.log(track[d.subject.toLowerCase()])
  //     // sum += (100 - Math.abs(track[d.subject.toLowerCase()] - d.A))
  //   })
  //   return sum
  // }
  //
  // getTracksData(tracks) {
  //   let ids = tracks.map(t => t.id)
  //   spotifyApi.getAudioFeaturesForTracks(ids).then((info) => {
  //     let dataTracks = [];
  //     tracks.forEach((t, i) => {
  //       dataTracks.push(Object.assign({}, t, info.audio_features[i]))
  //       console.log(dataTracks[i])
  //       dataTracks[i]['match'] = this.getMatch(dataTracks[i])
  //       if(dataTracks.length == tracks.length) {
  //         this.formatTracks(dataTracks)
  //       }
  //     })
  //   })
  // }

  getStatus(){
    let pop = this.state.hipster;
    spotifyApi.getMySavedTracks(this.state.offset).then((response) => {
      response.items.forEach(i => {
        pop += i.track.popularity;
      })
      pop = pop / response.items.length;
      if(response.next) {
        let off = this.state.offset += 50
        this.setState({
          offset: off
        })
        this.getStatus()
    } else {
        console.log(pop)
        pop = pop.toFixed(2)
        this.setState({
          hipster : pop
        })
      }
    })
  }

  getAnalysis(stuff) {
    let raw = {
      a: 0.00,
      d: 0.00,
      e: 0.00,
      i: 0.00,
      s: 0.00,
      v: 0.00
    }
    stuff.forEach((s) => {
      raw.a += s.acousticness;
      raw.d += s.danceability;
      raw.e += s.energy;
      raw.i += s.instrumentalness;
      raw.s += s.speechiness;
      raw.v += s.valence;
    })

    this.setState({
      data: [
      { subject: 'Acousticness', A: raw.a * 100 / stuff.length, fullMark: 100 },
      { subject: 'Danceability', A: raw.d * 100 / stuff.length, fullMark: 100},
      { subject: 'Energy', A: raw.e * 100 / stuff.length, fullMark: 100},
      { subject: 'Instrumentalness', A: raw.i * 100 / stuff.length, fullMark: 100},
      { subject: 'Speechiness', A: raw.s * 100 / stuff.length, fullMark: 100},
      { subject: 'Valence', A: raw.v * 100 / stuff.length, fullMark: 100}
    ]
    })
  }

  render() {
    return (
      <div className='App'>
        {this.state.loggedIn == false &&
          <a href='http://localhost:8888'> Login to Spotify </a>
        }
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
            <button onClick={() => this.getStatus()}>
              Am I A Hipster?
            </button>
            <button onClick={() => this.getLocalConcerts()}>
              Get Music for Upcoming Concerts
            </button>
          </div>
        }
        { this.state.loading == false &&
            (this.state.concerts.map(c =>
              <div>
                <h2>{c.displayName}</h2>
                <h3>{c.venue}</h3>
                <h3>{c.start['date']} {c.start['time']}</h3>
                <h4>{c.pop}</h4>
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
      </div>
    )
  }
}

export default App;
