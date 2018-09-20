import React, { Component } from 'react';
import logo from './logo.svg';
import SpotifyWebApi from 'spotify-web-api-js';
import './App.css';
import {RadarChart, Radar, PolarRadiusAxis, PolarAngleAxis, PolarGrid} from 'recharts';
const spotifyApi = new SpotifyWebApi();


class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      data: [],
      hipster: 0,
      offset: 0
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
    // let artists = ['Naked Giants', 'Don Babylon', 'Car Seat Headrest', 'Nightmare Air',
    // 'Gary Numan', 'Sweater Beats', 'Andrew Luce', 'Weathan', 'Matthew Thiessen And The Earthquakes', 'Owl City']
    // artists.forEach(a => {
    //   spotifyApi.search(a, ['artist']).then(val => {
    //     console.log(val)
    //   })
    // })
  }

  getStatus(){
    let pop = this.state.hipster;
    spotifyApi.getMySavedTracks(this.state.offset).then((response) => {
      console.log(response)
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
            {this.state.hipster > 80 ? 'Absolutely not' :
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
          </div>
        }
      </div>
    )
  }
}

export default App;
