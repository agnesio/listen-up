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
            <div className="hipsterPage">
            <div className="share">
              <div className="shareIcons">
                <FacebookShareButton url="areyouhipster.com" children="foo" quote={this.props.quote} className="shareIconButton">
                  <FacebookIcon size={60} round={true}/>
                </FacebookShareButton>
                <TwitterShareButton url="areyouhipster.com" children="foo"  title={this.props.quote} className="shareIconButton">
                  <TwitterIcon size={60} round={true}/>
                </TwitterShareButton>
                <RedditShareButton url="areyouhipster.com" children="foo" title={this.props.quote}  className="shareIconButton">
                  <RedditIcon size={60} round={true}/>
                </RedditShareButton>
                <EmailShareButton url="areyouhipster.com" children="foo"  subject="Hipster Test" body={this.props.quote} className="shareIconButton">
                  <EmailIcon size={60} round={true}/>
                </EmailShareButton>
              </div>
            </div>
              <div className="percentMessage">
                <h1>{100 - this.props.hipster}% Hipster</h1>
                <h2>{this.props.userMessage}</h2>
              </div>
              <div className="joinBeta">
              {this.props.hide ?
                <div>
                  <h3> Thanks for your interest! </h3>
                  <p> You are now on the list. </p>
                </div>
                :
                <div className="signup">
                  <h3>Want to explore some new music? <br/> Sign up for our mailing list to hear when our Beta is ready!</h3>
                  <input type="text" placeholder="themosthipster@gmail.com" value={this.props.email} onChange={(event) => this.props.userActions.updateEmail(event.target.value)}/>
                </div>
                }
                <ParticleEffectButton className="particleButton"
                  color='white'
                  hidden={this.props.submitting}
                  onComplete={() => this.props.userActions.hideForm()}
                  particlesAmountCoefficient={1}
                  >
                  <button className="submitButton" onClick={() => this.props.userActions.submitEmail(this.props.email)}> Submit </button>
                </ParticleEffectButton>
                <p onClick={() => this.props.userActions.openBeta()}>Wait... what Beta?</p>
                {this.props.betaOpen && (
                  <div className="description">
                    <p> We have an app in the works to connect music lovers to lesser known artists performing near them.
                    You&#39;ll be able to filter artists based on their genre, popularity, how well they match with your current music taste, and much more.</p>
                    <p> Listen directly on the platform, share with your friends, and maybe discover your new favorite band! Oh, and see them in person, if you&#39;re feelin&#39; it.</p>
                    <p> Pretty cool, huh?</p>
                  </div>
                )}
              </div>
              <div className="legal">
                <a href="https://app.termly.io/document/privacy-policy/23b4f8fd-d23f-48ee-9d04-3d2b2686aa42"> <p>Privacy Policy</p> </a>
                <a href="https://app.termly.io/document/terms-of-use-for-website/13103719-0f5d-40db-ae3d-8ff61debbac2"> <p>Terms of Use </p></a>
              </div>
            </div>
          </div>

            :
            <div className="loadingPage">
              <h1> {this.props.loadingMessage}...</h1>
            </div>
          )
          :
          <div className="landing">
            <h1> How Hipster Are You? </h1>
            <h3> Let us analyze your Spotify library to find out </h3>
            <a href='http://ec2-34-207-76-65.compute-1.amazonaws.com:8000/login'><button className="goButton"> GO </button></a>
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
