import { ADD_COUNTER } from "../constants/AddCounterConst";
import { cloneObject } from "../constants/FunctionConst";

const initState = {};

export default (state = initState, action) => {
    switch (action.type) {
        case ADD_COUNTER.CREATE: {
            const oldCounters = state.list && cloneObject(state.list) || {};
            const newCounters = {...action.payload, ...oldCounters};
            const sortedCounters = {};
            const keys = Object.keys(newCounters);
            keys.sort((key1, key2) => newCounters[key1].createTime - newCounters[key2].createTime)
                .forEach(key => sortedCounters[key] = newCounters[key]);

            return {
                ...state,
                list: {
                    ...sortedCounters
                }
            }
        }
        default: return state;
    }
}