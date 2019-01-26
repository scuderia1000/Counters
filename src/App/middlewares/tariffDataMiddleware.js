import { COUNTERS_VALUES } from "../constants/ActionConst";

export const tariffDataMiddleware = store => next => action => {
    console.log('action:', action)
    const result = next(action)

    const state = store.getState();
    console.log('state after action:', state);
    /*setImmediate(() => {
        store.dispatch({type: COUNTERS_VALUES.UPDATE, payload: state});
    });*/
    return result
    /*switch (action.type) {
        default: next(action)
    }*/
};