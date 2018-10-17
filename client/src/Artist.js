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


class Artist extends Component {

  render() {
    return (
      <div className="artist">
        {this.props.a.tracks.length > 0 &&
          <div>
          <table className="artistTable">
            <tr>
              <th valign="middle"> <div className="artistImageContainer"><img className="artistImage" src={this.props.a.image ? this.props.a.image : concertPic} /></div> </th>
              <th valign="middle">  <h2 className="artistName">{this.props.a.displayName}</h2> </th>
              <th valign="middle" className="match">{this.props.a.match < .01 ? 'No Match' : Math.round(this.props.a.match * 100) + '% Match'}</th>
            </tr>
            </table>
            <p>{getRecommendString(this.props.a)}</p>
            <table className="songList">
              {this.props.a.tracks.map( t =>
                <tr>
                  <td  valign="middle" className="buttonContainer">
                    <button className="playButton" onClick={() => this.props.concertActions.playSong(this.props.deviceId, t.id, t.uri, t.name, this.props.nowPlaying, this.props.playing)}>
                      <FontAwesomeIcon icon={this.props.playing && this.props.nowPlaying == t.uri ? faPause : faPlay}/>
                    </button>
                  </td>
                  <td  valign="middle" className="trackName">{t.name}</td>
                </tr>
              )}
          </table>
          </div>
        }
      </div>
    )
  }

}

function getRecommendString(a) {
  if(a.match > 0.01) {
    if(a.userArtists.length > 0) {
      if(a.userArtists[0] == a['displayName']) {
        return "You have this artist in your library!"
      } else {
        let str = "Matched based on similar artists in your library: "
        str += a.userArtists.join(", ")
        return str
      }
    } else {
      let str = "Matched based on genres in your library: "
      str += a.userGenres.join(", ")
      return str
    }
  } else {
    return '';
  }
}

function mapStateToProps(state) {
  return {
    token: state.auth.token,
    deviceId: state.auth.device,
    nowPlaying: state.player.song,
    playing: state.player.playing,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    concertActions: bindActionCreators(concertActions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Artist);
