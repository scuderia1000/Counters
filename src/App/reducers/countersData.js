import { COUNTER_DATA } from "../constants/ActionConst";

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case COUNTER_DATA.SAVE: {
            return {
                ...state,
                ...action.payload
            }
        }
        default: return state;
    }
}