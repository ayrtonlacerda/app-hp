import { combineReducers } from 'redux';

import newState from './new';
import formState from './form';
import histState from './hist';
import groupState from './group';
import loginState from './login';
import noteState from './notes';

export default combineReducers({
  newState,
  formState,
  histState,
  groupState,
  loginState,
  noteState,
});

/*empty: (state = {}) => state,*/
