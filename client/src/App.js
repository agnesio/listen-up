import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authActions from './actions/authActions';
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


class App extends Component {
  componentWillMount() { // HERE WE ARE TRIGGERING THE ACTION
     this.props.authActions.login();
   }
  render() {
    return (
      <div className="App">
      <div className="noParticle">
        {this.props.loggedIn ?
          (this.props.hipster ?
            <div className="hipsterPage">
              <div className="percentMessage">
                <h1>{100 - this.props.hipster}% Hipster</h1>
                <h2>{this.props.userMessage}</h2>
              </div>
              <div className="share">
                <div className="shareIcons">
                  <FacebookShareButton url="jenniferpridemore.com" children="foo" quote={this.props.quote} className="shareIconButton">
                    <FacebookIcon size={50} round={true}/>
                  </FacebookShareButton>
                  <TwitterShareButton url="jenniferpridemore.com" children="foo"  title={this.props.quote} className="shareIconButton">
                    <TwitterIcon size={50} round={true}/>
                  </TwitterShareButton>
                  <RedditShareButton url="jenniferpridemore.com" children="foo" title={this.props.quote}  className="shareIconButton">
                    <RedditIcon size={50} round={true}/>
                  </RedditShareButton>
                  <EmailShareButton url="jenniferpridemore.com" children="foo"  subject="Hipster Test" body={this.props.quote} className="shareIconButton">
                    <EmailIcon size={50} round={true}/>
                  </EmailShareButton>
                </div>
              </div>
              <div className="joinBeta">
                <h3>Want to explore some new music? Sign up for our mailing list to hear when Hipup Beta is ready!</h3>
                <p>Wait... what is Hipup?</p>

              </div>
            </div>
            :
            <div className="loadingPage">
              <h1> {this.props.loadingMessage}... </h1>
            </div>
          )
          :
          <div className="landing">
            <h1> How Hipster Are You? </h1>
            <h3> Let us analyze your Spotify library to find out! </h3>
            <a href='http://localhost:8888/'><button className="goButton"> GO </button></a>
          </div>
        }
        </div>
        <Particles
        style={{
            'position': 'absolute',
            'width': '100vw',
            'height': '100vh',
            'z-index': -1
          }}
        />
      </div>
    );
  }
}

App.propTypes = {
  authActions: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    loggedIn: state.auth.loggedIn,
    concerts: state.concerts,
    hipster: state.user.hipster,
    quote: getQuote(100-state.user.hipster),
    loadingMessage: state.user.loadingMessage,
    userMessage: getMessage(state.user.hipster)
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
    authActions: bindActionCreators(authActions, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
