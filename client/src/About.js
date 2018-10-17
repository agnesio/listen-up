import React, { Component } from 'react';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import * as authActions from './actions/authActions';
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
        <p>Want to receive custom concert listings and be the first to hear about new features?
        Join our mailing list</p>
        <p>Have some suggestions? Shoot us a message.</p>
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(authActions, dispatch),
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
) (About);
