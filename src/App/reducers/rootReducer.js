// react
import { combineReducers } from 'redux';
// libraries

// own component
import counters from './counters';
import tariffs from './tariffs';
// styles

const rootReducer = combineReducers({
    counters,
    tariffs,
});
export default rootReducer;