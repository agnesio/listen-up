
import {combineReducers} from 'redux';
import concerts from './concertsReducer';
import auth from './authReducer';
import user from './userReducer';
import player from './playerReducer'

const rootReducer = combineReducers({
  concerts,
  auth,
  user,
  player
});

export default rootReducer;
