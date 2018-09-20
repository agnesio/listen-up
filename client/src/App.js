import React, { Component } from 'react';
import logo from './logo.svg';
import SpotifyWebApi from 'spotify-web-api-js';
import './App.css';
import {RadarChart, Radar, PolarRadiusAxis, PolarAngleAxis, PolarGrid} from 'recharts';
const spotifyApi = new SpotifyWebApi();


class App extends Component {
  constructor(){
    super();
    this.playerCheckInterval = null;
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      console.log(token)
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
      artistTracks: [],
      error: "",
      trackName: "Track Name",
      artistName: "Artist Name",
      albumName: "Album Name",
      playing: false,
      position: 0,
      duration: 0,
      deviceId: ""
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
      console.log(token)
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
    this.player.on('player_state_changed', state => { console.log(state); });

    // Ready
    this.player.on('ready', data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      this.setState({ deviceId: device_id });
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
  }

  getLocalConcerts(){
    let artists = ['Naked Giants', 'Don Babylon', 'Car Seat Headrest', 'Nightmare Air',
    'Gary Numan', 'Sweater Beats', 'Andrew Luce', 'Weathan', 'Matthew Thiessen And The Earthquakes', 'Owl City']
    let tracks = this.state.artistTracks
    artists.forEach(a => {
      spotifyApi.searchArtists(a).then(val => {
        if (val && val.artists.items.length > 0){
          spotifyApi.getArtistTopTracks(val.artists.items[0]['id'], 'from_token').then(result => {
            tracks.concat(result.tracks.slice(0,3))
            this.setState({
              artistTracks: tracks,
            })
          })
        }
      })
    })
  }

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
      raw.a = (raw.a + s.acousticness);
      raw.d = (raw.d + s.danceability);
      raw.e = (raw.e + s.energy);
      raw.i = (raw.i + s.instrumentalness);
      raw.s = (raw.s + s.speechiness);
      raw.v = (raw.v + s.valence);
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
        {this.state.data.length > 0 &&
          <div className="chart">
          <RadarChart className="analysisChart" cx={200} cy={200} outerRadius={100} width={400} height={400} data={this.state.data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject"/>
            <PolarRadiusAxis/>
            <Radar dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
          </RadarChart>
          </div>
        }
        { this.state.loggedIn &&
          <div>
            <button onClick={() => this.getMood()}>
              Analyze My Last 50 Songs
            </button>
            <button onClick={() => this.getStatus()}>
              Am I A Hipster?
            </button>
            <button onClick={() => this.getLocalConcerts()}>
              Get Music for Upcoming Concerts
            </button>
          </div>
        }
      </div>
    )
  }
}

export default App;
