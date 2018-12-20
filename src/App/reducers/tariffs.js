import {TARIFF} from "../constants/ActionConst";
import {cloneObject} from "../constants/FunctionConst";

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
        case TARIFF.REMOVE: {
            const counterId = action.payload;
            const tariffsList = state.list && cloneObject(state.list) || {};
            delete tariffsList[counterId];
            return {
                ...state,
                list: tariffsList
            }
        }
        default: return state;
    }
}