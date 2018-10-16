
import {combineReducers} from 'redux';
import concerts from './concertsReducer';
import auth from './authReducer';
import user from './userReducer';
import player from './playerReducer'
import location from './locationReducer'
import { reducer as geolocation } from 'react-redux-geolocation';
import nav from './navigationReducer'

const rootReducer = combineReducers({
  concerts,
  auth,
  user,
  player,
  location,
  nav
});

export default rootReducer;
