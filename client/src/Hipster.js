import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authActions from './actions/authActions';
import * as userActions from './actions/userActions';
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

class Hipster extends Component {

   //FOR PRODUCTION: Change IP Address from localhost:8888 to server endpoint (either areyouhipster.com:8888/login/ or aws?)

  render() {
    return (
      <div className="noParticle">
        {this.props.loggedIn ?
          (this.props.hipster ?
            <div>
              <p>Placeholder</p>
            </div>
            :
            <div className="loadingPage">
              <h1> {this.props.loadingMessage}...</h1>
            </div>
          )
          :
          <div className="landing">
            <h1> How Hipster Are You? </h1>
            <h3> Let us analyze your Spotify library to find out  </h3>
            <a href='http://ec2-34-230-1-236.compute-1.amazonaws.com:8000/login'><button className="goButton"> GO </button></a>
          </div>
        }
        </div>
    );
  }
}

Hipster.propTypes = {
  authActions: PropTypes.object,
  userActions: PropTypes.object
};

function mapStateToProps(state) {
  return {
    loggedIn: state.auth.loggedIn,
    concerts: state.concerts,
    hipster: state.user.hipster,
    quote: getQuote(100-state.user.hipster),
    loadingMessage: state.user.loadingMessage,
    userMessage: getMessage(state.user.hipster),
    hide: state.user.submitted,
    email: state.user.email,
    betaOpen: state.user.betaOpen,
    submitting: state.user.submitting
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
)(Hipster);
