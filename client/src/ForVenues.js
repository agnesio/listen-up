import React, { Component } from 'react';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import * as authActions from './actions/authActions';
import * as userActions from './actions/userActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class ForVenues extends Component {

  render() {
    return (
      <div className="about">
        <h2> Venue Offerings </h2>
        <p>Sorting through artist submissions constantly and searching for ones that fit your
        criteria isn&#39;t easy. That&#39;s why we&#39;re working on expanding our platform to
        help match artists and venues, based on past shows, genre, popularity, and much more.
        While our Beta doesn&#39;t have these tools for venues yet, we are planning to release a
        version in the near future with promotional tools and analytics for venues to use.</p>
        {this.props.mailingSubmit ?
          <p>Thanks for your interest!</p>
          :
          <div>
            <p>Want to be the first to hear when we release this? Join our artist mailing list.</p>
            <input type="email" className="mailingInput" placeholder="awesome_venue@example.com" onChange={(e) => this.props.userActions.setEmail(e.target.value)}/>
            <button onClick={()=> this.props.userActions.mailingList('venue', this.props.email)}>Submit</button>
          </div>
        }
        {this.props.feedbackSubmit ?
          <p>Thanks for your input!</p>
          :
          <div>
            <p>Have suggestions for features or feedback for this offering, or the app in general? Send us a message. </p>
            <input type="email" className="feedbackEmail"  onChange={(e)=> this.props.userActions.setEmail(e.target.value)}/>
            <input type="textarea" className="feedbackInput" onBlur={(e)=> this.props.userActions.setFeedback(e.target.value)}/>
            <button onClick={()=> this.props.userActions.feedback('venue', this.props.email, this.props.feedback)}>Send</button>
          </div>
        }
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
    email: state.user.formEmail,
    feedback: state.user.feedback,
    mailingSubmit: state.user.mailingList.indexOf('venue') != -1,
    feedbackSubmit: state.user.feedbackList.indexOf('venue') != -1,
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
) (ForVenues);
