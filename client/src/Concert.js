import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authActions from './actions/authActions';
import * as userActions from './actions/userActions';
import * as concertActions from './actions/concertActions';
import PropTypes from 'prop-types';

const ConcertCard = ({concert}) => (
  <div className="concerts">
  <div className="concertHeader">
    <a href={concert.url}><h1 className="concertTitle">{concert.displayName}</h1></a>
  </div>
    {concert.artists.map(a =>
      (a['valid'] &&
        <div className="artists">
          <div className="artistHeader" style={{backgroundImage:'url(' + a['image'] + ')'}}>
            <h2 className="artistName">{a.displayName}</h2>
            {a.tracks && (
              <div>
              a.tracks.map (t => {
                <h2> t.name </h2>
              })
              </div>
            )}
          </div>
          <h4>{a.match}</h4>
        </div>
      )
    )}
  </div>
)


export default ConcertCard
