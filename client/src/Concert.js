import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as authActions from './actions/authActions';
import * as userActions from './actions/userActions';
import * as concertActions from './actions/concertActions';
import PropTypes from 'prop-types';
import Artist from './Artist'

const ConcertCard = ({concert}) => (
    <div className="concert">
      <div className="concertTitleContainer" style={{background:
        'linear-gradient(to bottom,rgba(0, 0, 0, 0.2),rgba(0, 0, 0, .6)), url(' + concert['artists'][0]['image'] + ') no-repeat center'}}>
        <a href={concert.url}><h2 className="concertTitle">{concert.displayName}</h2></a>
      </div>
        {concert.artists.map(a =>
            <Artist a={a} />
        )}
    </div>
)


export default ConcertCard
