import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authActions from './actions/authActions';
import * as userActions from './actions/userActions';
import * as concertActions from './actions/concertActions';
import PropTypes from 'prop-types';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();


class Artist extends Component {

  render() {
    return (
      <div className="artist">
        <table className="artistTable">
        <tr>
          <th valign="middle">  <img className="artistImage" src={this.props.a.image} /> </th>
          <th valign="middle">  <h2 className="artistName">{this.props.a.displayName}</h2> </th>
          <th>{this.props.a.match}</th>
        </tr>
          {this.props.a.tracks.map( t =>
            <tr>
              <td><button onClick={() => this.props.concertActions.playSong(this.props.deviceId, t.uri)}> Play</button></td>
              <td>{t.name}</td>
            </tr>
          )}
        </table>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    song: state.concerts.song,
    token: state.auth.token,
    deviceId: state.auth.device
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
