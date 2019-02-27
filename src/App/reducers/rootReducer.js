// react
import { combineReducers } from 'redux';
// libraries

// own component
import counters from './counters';
import tariffs from './tariffs';
import tariffsData from './tariffsData';

const rootReducer = combineReducers({
    counters,
    tariffs,
    tariffsData,
});
export default rootReducer;