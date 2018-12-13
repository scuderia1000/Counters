import uuid from 'uuid';
import { COUNTER } from "../../../constants/ActionConst";

export const createCounter = (counterData, id) => {
    let counterId = '';
    if (id) {
        counterId = id;
    } else {
        counterId = uuid.v4();
        counterData.id = counterId;
        counterData.createTime = new Date().getTime();
    }


    return (dispatch, getState) => {
        dispatch({
            type: COUNTER.CREATE,
            payload: {
                [counterId]: {
                    ...counterData
                }
            }
        })
    }
};
/*

export const createCounterTariff = (counterId, data) => {

    return (dispatch, getState) => {
        dispatch({
            type: TARIFF.CREATE,
            payload: {

            }
        })
    }
};*/
