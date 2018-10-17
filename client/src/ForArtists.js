import React, { Component } from 'react';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import * as authActions from './actions/authActions';
import * as userActions from './actions/userActions';
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
        {this.props.mailingSubmit ?
          <p>Thanks for your interest!</p>
          :
          <div>
            <p>Want to be the first to hear when we release this? Join our artist mailing list.</p>
            <input type="email" className="mailingInput" placeholder="awesome_artist@example.com" onChange={(e) => this.props.userActions.setEmail(e.target.value)}/>
            <button onClick={()=> this.props.userActions.mailingList('artist', this.props.email)}>Submit</button>
          </div>
        }
        {this.props.feedbackSubmit ?
          <p>Thanks for your input!</p>
          :
          <div>
            <p>Have suggestions for features or feedback for the app? Hit us up. </p>
            <input type="email" className="feedbackEmail"  onChange={(e)=> this.props.userActions.setEmail(e.target.value)}/>
            <input type="textarea" className="feedbackInput" onBlur={(e)=> this.props.userActions.setFeedback(e.target.value)}/>
            <button onClick={()=> this.props.userActions.feedback('artist', this.props.email, this.props.feedback)}>Send</button>
          </div>
        }
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
    email: state.user.formEmail,
    feedback: state.user.feedback,
    mailingSubmit: state.user.mailingList.indexOf('artist') != -1,
    feedbackSubmit: state.user.feedbackList.indexOf('artist') != -1,
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
) (ForArtists);
