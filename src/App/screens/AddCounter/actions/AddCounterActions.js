import uuid from 'uuid';
import { ADD_COUNTER } from "../../../constants/AddCounterConst";

export const createCounter = (counterData) => {
    const counterId = uuid.v4();
    counterData.id = counterId;
    counterData.createTime = new Date().getTime();

    return (dispatch, getState) => {
        dispatch({
            type: ADD_COUNTER.CREATE,
            payload: {
                [counterId]: {
                    ...counterData
                }
            }
        })
    }
};