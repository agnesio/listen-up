import React, { Component } from 'react';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import * as authActions from './actions/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//TODO: change company name

class ForArtists extends Component {

  render() {
    return (
      <div className="about">
        <h2> Artist Offerings </h2>
        <p>Our mission at Fresh Verses is to help small artists grow their fan bases,
        by decluttering the live music scene and making it easier to go out to shows.
        While our Beta doesn&#39;t offer any additional tools for artists currently,
        we are planning to release a version in the near future with promotional tools and
        analytics for artists to use.</p>
        <p>Want to be the first to hear when we release this? Join our artist mailing list.</p>
        <p>Have suggestions for features or feedback for the app? Hit us up. </p>
      </div>
    );
  }
}

ForArtists.propTypes = {
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
) (ForArtists);
