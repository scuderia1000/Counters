import {COUNTER, TARIFF} from '../../../constants/ActionConst'

export const editCounter = (counterId) => {
    return (dispatch, getState) => {
        dispatch({
            type: COUNTER.EDIT,
            payload: counterId
        })
    }
};

export const removeCounter = (counterId) => {
    return (dispatch, getState) => {
        dispatch({
            type: COUNTER.REMOVE,
            payload: counterId
        })
    }
};

export const removeCounterTariffs = (counterId) => {
    return (dispatch, getState) => {
        dispatch({
            type: TARIFF.REMOVE,
            payload: counterId
        })
    }
};