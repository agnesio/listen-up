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
class App extends Component {
  componentWillMount() { // HERE WE ARE TRIGGERING THE ACTION
     this.props.authActions.login();
   }

  render() {
    return (
      <div className="">
        {this.props.loggedIn ?
          (this.props.hipster ?
            <div className="hipsterPage">
              <h1>{100 - this.props.hipster}% Hipster</h1>
              <h4>Share how hipster you are with your friends!</h4>
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
              <div className="joinBeta">
                <h4>Want to explore some new music? Sign up for our mailing list to hear when Hipup Beta is ready!</h4>
                <p>Wait... what is Hipup?</p>

              </div>
            </div>
            :
            <div className="loadingPage">
              <h1> Loading </h1>
            </div>
          )
          :
          <div className="landing">
            <h1> How Hipster Are You? </h1>
            <p> Let us analyze your Spotify library to find out! </p>
            <a href='http://ec2-34-207-76-65.compute-1.amazonaws.com:8000/login'><button className="goButton"> Go </button></a>
          </div>
        }
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
    quote: getQuote(100-state.user.hipster)
  };
}

function getQuote(percent) {
  let quote = "I got "+percent+"% hipster! How hipster are you?"
  return quote;
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
