import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Hipster from './Hipster.js'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authActions from './actions/authActions';
import * as userActions from './actions/userActions';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Particles from 'react-particles-js';
import ParticleEffectButton from 'react-particle-effect-button'

class App extends Component {

  componentWillMount() {
      //Auto login once oAuth returns a token
     this.props.authActions.login();
   }

   //FOR PRODUCTION: Change IP Address from localhost:8888 to prod server

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
//     'z-index': -1,
//     'background' : 'rgb(38, 33, 50)'
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

function getQuote(percent) {
  let quote = "I got "+percent+"% hipster! How hipster are you?"
  return quote;
}

function getMessage(percent){
  let p = percent > 80 ? 'Absolutely not hipster' :
          percent > 65 ? "Eh you're not totally mainstream" :
            percent > 50 ? "You know some hidden tracks" :
              percent > 40 ? "People go to you for music" :
                percent > 30 ? "You even know the underground scene" :
                  percent > 20 ? "Do people ever know what you're listening to?" :
                  "Certified hipster"
  return p
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
