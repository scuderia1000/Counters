// react
import { combineReducers } from 'redux';
// libraries

// own component
import counters from './counters';
import tariffs from './tariffs';
import tariffsData from './tariffsData';
import countersValues from './countersValues';

const rootReducer = combineReducers({
    counters,
    tariffs,
    tariffsData,
    countersValues,
});
export default rootReducer;