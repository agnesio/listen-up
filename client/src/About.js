import React, { Component } from 'react';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import * as authActions from './actions/authActions';
import * as userActions from './actions/userActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//TODO: enter actual brand name

class About extends Component {

  render() {
    return (
      <div className="about">
        <h2> What We&#39;re About </h2>
        <p>Jealous of those people who saw your favorite artist before they &#39;got big&#39;?
        Well now you don’t have to be. Welcome to Fresh Verses, the metal detector for
        needle-in-the-haystack bands playing near you.</p>
        <p>We use Spotify to analyze your music taste, and Sonkick to grab concerts happening
        in your area. Our algorithm is always improving, and our team is eager to add new features.</p>
        {this.props.mailingSubmit ?
          <p>Thanks for your interest!</p>
          :
          <div>
            <p>Want to receive custom concert listings and be the first to hear about new features?
            Join our mailing list</p>
            <input type="email" className="mailingInput" placeholder="awesome_artist@example.com" onChange={(e) => this.props.userActions.setEmail(e.target.value)}/>
            <button onClick={()=> this.props.userActions.mailingList('about', this.props.email)}>Submit</button>
          </div>
        }
        {this.props.feedbackSubmit ?
          <p>Thanks for you feedback!</p>
          :
          <div>
            <p>Have some suggestions? Shoot us a message.</p>
            <input type="email" className="feedbackEmail"  onChange={(e)=> this.props.userActions.setEmail(e.target.value)}/>
            <input type="textarea" className="feedbackInput" onBlur={(e)=> this.props.userActions.setFeedback(e.target.value)}/>
            <button onClick={()=> this.props.userActions.feedback('about', this.props.email, this.props.feedback)}>Send</button>
          </div>
        }
      </div>
    );
  }
}

About.propTypes = {
  authActions: PropTypes.object,
  userActions: PropTypes.object,
  concertActions: PropTypes.object
};

function mapStateToProps(state) {
  return {
    loggedIn: state.auth.loggedIn,
    email: state.user.formEmail,
    feedback: state.user.feedback,
    mailingSubmit: state.user.mailingList.indexOf('about') != -1,
    feedbackSubmit: state.user.feedbackList.indexOf('about') != -1,
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
) (About);
