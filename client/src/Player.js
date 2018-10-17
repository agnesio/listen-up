import React, { Component } from 'react';
import concertPic from './images/default.jpeg';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authActions from './actions/authActions';
import * as userActions from './actions/userActions';
import * as concertActions from './actions/concertActions';
import PropTypes from 'prop-types';
import SpotifyWebApi from 'spotify-web-api-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { faPause } from '@fortawesome/free-solid-svg-icons'
const spotifyApi = new SpotifyWebApi();


class Player extends Component {

  render() {
    return (
      <div className="player">
        <div className="buttonContainerCurr">
        <button className="playButton" onClick={() => this.props.concertActions.playSong(this.props.deviceId, this.props.id, this.props.songUri, this.props.songName,this.props.songUri, this.props.playing)}>
          <FontAwesomeIcon icon={this.props.playing ? faPause : faPlay}/>
        </button>
        </div>
        <div className="playInfo">
          <p className="songName">{this.props.songName}</p>
          <p className={this.props.added != -1 ? 'addedButton' : 'addButton'} onClick={() => this.props.userActions.addToLibrary(this.props.id, this.props.added)}>
          {this.props.added != -1 ? 'Added to your library' : 'Add to your library?'}
          </p>
        </div>
      </div>
    )
  }

}


function mapStateToProps(state) {
  return {
    token: state.auth.token,
    deviceId: state.auth.device,
    songName: state.player.name,
    songUri: state.player.song,
    playing: state.player.playing,
    id: state.player.trackId,
    added: state.user.addedSongs.indexOf(state.player.trackId)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    concertActions: bindActionCreators(concertActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player);
