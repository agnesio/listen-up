import React, { Component } from 'react';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import * as authActions from './actions/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class ForVenues extends Component {

  render() {
    return (
      <div className="about">

      </div>
    );
  }
}

ForVenues.propTypes = {
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
) (ForVenues);
