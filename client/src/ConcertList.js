import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';

class ConcertList extends Component {
  componentWillMount() {

   }

  render() {
    return (
      <div>
      {this.props.concerts.map(c =>
        <div className="concerts">
          <a href={c.url}><h2>{c.displayName}</h2></a>
          <h3>{c.venue}</h3>
          <h3>{c.start['date']} {c.start['time']}</h3>
          <h4>{c.pop}</h4>
          <table>
            {c.artists.map(a =>
              <tr>
                <td>{a.displayName}</td>
                {a.tracks.map(t =>
                  <tr>
                    <td><button> Play </button></td>
                    <td>{t.name}</td>
                    <td>
                      {t.artists
                      .map(artist => artist.name)
                      .join(", ")}
                    </td>
                  </tr>
                )}
              </tr>
            )}
          </table>
        </div>
      )
    }
    </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    concerts: state.concerts
  };
}

export default connect(
  mapStateToProps
)(ConcertList);
