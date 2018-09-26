
import {combineReducers} from 'redux';
import concerts from './concertsReducer';
import auth from './authReducer';
import user from './userReducer';

const rootReducer = combineReducers({
  concerts,
  auth,
  user
});

export default rootReducer;
