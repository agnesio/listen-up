import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authActions from './actions/authActions';
import * as userActions from './actions/userActions';
import * as concertActions from './actions/concertActions';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  RedditIcon,
  EmailIcon
} from 'react-share';
import Particles from 'react-particles-js';
import ParticleEffectButton from 'react-particle-effect-button'
import ConcertCard from './Concert.js'
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();



class Hipster extends Component {

  componentWillMount() {
    this.playerCheckInterval = setInterval(() => this.checkForPlayer(this.props.token), 1000);
    this.checkForPlayer(this.props.token)
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
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });

    // Playback status updates
    this.player.on('player_state_changed', state => this.onStateChanged(state));

    // Ready
    this.player.on('ready', async data => {
      console.log('setting')
      console.log(data)
      let { device_id } = data;
      await this.props.authActions.setDevice(device_id);
      this.transferPlaybackHere();
    });
  }

  onStateChanged(state) {
    console.log(state)
  //   // if we're no longer listening to music, we'll get a null state.
  //   if (state !== null) {
  //     const {
  //       current_track: currentTrack,
  //       position,
  //       duration,
  //     } = state.track_window;
  //     const trackName = currentTrack.name;
  //     const albumName = currentTrack.album.name;
  //     const artistName = currentTrack.artists
  //       .map(artist => artist.name)
  //       .join(", ");
  //     const playing = !state.paused;
  //     this.setState({
  //       position,
  //       duration,
  //       trackName,
  //       albumName,
  //       artistName,
  //       playing
  //     });
  //   }
  }

  transferPlaybackHere() {
    console.log('transferring playback')
    spotifyApi.transferMyPlayback([this.props.deviceId]).then(val => {
      console.log(val)
    })
  }

  render() {
    return (
      <div className="noParticle">
        {this.props.loggedIn ?
          (!this.props.loading ?
            <div>
            <h1 className="primaryHeader"> Upcoming Concerts </h1>
            <h2 className="locationHeader"> Displaying concerts in {this.props.locName}</h2>
            {this.props.concerts.map(c =>
              <ConcertCard concert={c} />
            )}
            <div className="loadButtonWrapper">
              <button className="loadButton" onClick={() => this.props.concertActions.getConcerts(this.props.page)}>Load More </button>
            </div>
            </div>
            :
            <div className="loadingPage">
              <h1> {this.props.loadingMessage}...</h1>
            </div>
          )
           :
          <div className="landing">
            <h1> Listen Up. Be Heard. Go Play. </h1>
            <h3> Log in with Spotify to disover artists performing near you, for you </h3>
            <a href='http://ec2-34-230-1-236.compute-1.amazonaws.com:8000/login'><button className="goButton"> GO </button></a>
          </div>
        }
        </div>
    );
  }
}

Hipster.propTypes = {
  authActions: PropTypes.object,
  userActions: PropTypes.object,
  concertActions: PropTypes.object
};

function mapStateToProps(state) {
  return {
    loggedIn: state.auth.loggedIn,
    concerts: state.concerts.concerts,
    loadingMessage: state.user.loadingMessage,
    loading: state.auth.loading,
    hide: state.user.submitted,
    email: state.user.email,
    betaOpen: state.user.betaOpen,
    submitting: state.user.submitting,
    page: state.concerts.page,
    token: state.auth.token,
    deviceId: state.auth.device,
    locName: state.location.name,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
    concertActions: bindActionCreators(concertActions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hipster);
