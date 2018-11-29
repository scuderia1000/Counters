// react
import { combineReducers } from 'redux';
// libraries

// own component
import counters from './counters';
// styles

const rootReducer = combineReducers({
    counters
});
export default rootReducer;