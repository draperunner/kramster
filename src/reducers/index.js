import { combineReducers } from 'redux';
import loading from './loading';
import questions from './questions';

export default combineReducers({
  loading,
  questions,
});
