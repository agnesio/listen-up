import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Hipster from './Hipster.js'
import About from './About.js'
import ForArtists from './ForArtists.js'
import ForVenues from './ForVenues.js'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authActions from './actions/authActions';
import * as userActions from './actions/userActions';
import PropTypes from 'prop-types';
import { GeoLocation } from 'react-redux-geolocation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends Component {

  componentWillMount() {
      //Auto login once oAuth returns a token
     this.props.authActions.login();
   }

  render() {
    return (
      <Router>
        <div className="App">
        <div className="navBar">
        <div className="navBarContent">
            { this.props.loggedIn &&
              <Link to={"/#access_token=" + this.props.token}><div className="navTabLogo">Home</div></Link>
            }
            <Link to="/artists"><div className="navTab">For Artists</div></Link>
            <Link to="/venues"><div className="navTab">For Venues</div></Link>
            <Link to="/about"><div className="navTab">About</div></Link>
            {this.props.loggedIn &&
              <div className="navTab" onClick={() => this.props.userActions.toggleNav(!this.props.navOpen)}><img className="userProfPic" src={this.props.pic} /></div>
            }
        </div>
          {this.props.navOpen &&
            <div>
              <div className="dropdownTooltip"></div>
              <div className="userDropDown">
                <Link to="/"><div className="dropOption" onClick={() => this.props.authActions.setLogOut()}><p>Logout</p></div></Link>
              </div>
            </div>
          }
        </div>
          <Route exact path="/" component={Hipster} />
          <Route path="/artists" component={ForArtists}/>
          <Route path="/venues" component={ForVenues}/>
          <Route path="/about" component={About}/>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  authActions: PropTypes.object,
  userActions: PropTypes.object,
  concertActions: PropTypes.object
};

function mapStateToProps(state) {
  return {
    loggedIn: state.auth.loggedIn,
    name: state.user.name,
    pic: state.user.pic,
    navOpen: state.nav.navOpen,
    token: state.auth.token
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
) (App);
