import uuid from 'uuid';
import { COUNTER_DATA } from "../../../constants/ActionConst";

export const saveData = (counterId, ) => {
    return (dispatch, getState) => {
        dispatch({
            type: COUNTER_DATA,
            payload: ''
        })
    }
};