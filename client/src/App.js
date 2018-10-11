import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Hipster from './Hipster.js'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authActions from './actions/authActions';
import * as userActions from './actions/userActions';
import PropTypes from 'prop-types';
import { GeoLocation } from 'react-redux-geolocation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Particles from 'react-particles-js';
import ParticleEffectButton from 'react-particle-effect-button'

class App extends Component {

  componentWillMount() {
      //Auto login once oAuth returns a token
     this.props.authActions.login();
   }

  render() {
    return (
      <div className="App">
        <Hipster />
      </div>
    );
  }
}

// <Particles
// style={{
//     'position': 'absolute',
//     'width': '100vw',
//     'height': '100vh',
//     'background' : 'white',
//     'color' : 'red'
//   }}
// />

App.propTypes = {
  authActions: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    loggedIn: state.auth.loggedIn,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
) (App);
