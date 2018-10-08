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


class Hipster extends Component {

  render() {
    return (
      <div className="noParticle">
        {this.props.loggedIn ?
          (!this.props.loading ?
            <div>
            <h1 className="primaryHeader"> Upcoming Concerts </h1>
            {this.props.concerts.map(c =>
              <ConcertCard concert={c} />
            )}
            <button className="loadButton" onClick={() => this.props.concertActions.getConcerts(this.props.page)}>Load More </button>
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
    hipster: state.user.hipster,
    quote: getQuote(100-state.user.hipster),
    loadingMessage: state.user.loadingMessage,
    loading: state.auth.loading,
    userMessage: getMessage(state.user.hipster),
    hide: state.user.submitted,
    email: state.user.email,
    betaOpen: state.user.betaOpen,
    submitting: state.user.submitting,
    page: state.concerts.page
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
    userActions: bindActionCreators(userActions, dispatch),
    concertActions: bindActionCreators(concertActions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Hipster);
