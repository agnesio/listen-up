import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authActions from './actions/authActions';
import PropTypes from 'prop-types';

class App extends Component {
  componentWillMount() { // HERE WE ARE TRIGGERING THE ACTION
     this.props.authActions.login();
   }

  render() {
    return (
      <div className="">
        {this.props.loggedIn ?
          <h1>LOGGED IN</h1> :
          <div className="landing">
            <h1> How Hipster Are You? </h1>
            <p> Let us analyze your Spotify library to find out! </p>
            <button href='http://localhost:8888' className="goButton"> Go </button>
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
    concerts: state.concerts
  };
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
