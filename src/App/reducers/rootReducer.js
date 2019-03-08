// react
import { combineReducers } from 'redux';
// libraries

// own component
import counters from './counters';
import tariffs from './tariffs';
import tariffsData from './tariffsData';
import alert from './alert';

const rootReducer = combineReducers({
    counters,
    tariffs,
    tariffsData,
    alert,
});
export default rootReducer;