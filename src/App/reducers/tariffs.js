import {TARIFF} from "../constants/ActionConst";

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case TARIFF.CREATE: {
            return {
                ...state,
                list: {
                    ...action.payload
                }
            }
        }
        default: return state;
    }
}