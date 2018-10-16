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

class Nav extends Component {

    // <div className="navBarContent">
            // </div>
  render() {
    return (
      <div className="navBar">

          <div className="navTab">About</div>
          {this.props.loggedIn &&
            <div className="navTab" onClick={() => this.props.userActions.toggleNav(!this.props.navOpen)}><img className="userProfPic" src={this.props.pic} /></div>
          }

        {this.props.navOpen &&
          <div>
            <div className="dropdownTooltip"></div>
            <div className="userDropDown">
              <div className="dropOption" onClick={() => this.props.authActions.setLogOut()}><p>Logout</p></div>
            </div>
          </div>
        }
      </div>
    );
  }
}

Nav.propTypes = {
  authActions: PropTypes.object,
  userActions: PropTypes.object,
  concertActions: PropTypes.object
};

function mapStateToProps(state) {
  return {
    loggedIn: state.auth.loggedIn,
    name: state.user.name,
    pic: state.user.pic,
    navOpen: state.nav.navOpen
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
  mapDispatchToProps
)(Nav);
