import counter from './counter';
import sample from './sample';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({counter, sample});

export default rootReducer;