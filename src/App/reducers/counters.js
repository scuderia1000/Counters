import { ADD_COUNTER } from "../constants/AddCounterConst";

const initState = {};

export default (state = initState, action) => {
    switch (action.type) {
        case ADD_COUNTER.CREATE: {
            return {
                ...state,
                list: {
                    ...state.list,
                    ...action.payload
                }
            }
        }
        default: return state;
    }
}