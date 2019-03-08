import { ALERT } from '../constants/ActionConst';

const initState = {};

export default (state = initState, action) => {
    switch (action.type) {
        case ALERT.SHOW: {
            return {
                ...state,
                ...action.payload
            }
        }
        case ALERT.RESET: {
            return initState
        }

        default: return state;
    }
}