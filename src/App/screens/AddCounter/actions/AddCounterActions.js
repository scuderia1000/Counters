import uuid from 'uuid';
import {COUNTER, TARIFF} from "../../../constants/ActionConst";

export const createCounter = (counterData, id) => {
    counterData.id = id;
    counterData.createTime = Date.now();

    return (dispatch, getState) => {
        dispatch({
            type: COUNTER.CREATE,
            payload: {
                [id]: {
                    ...counterData
                }
            }
        })
    }
};

export const createCounterTariff = (counterId, data) => {
    const tariffData = {};
    const keys = Object.keys(data);
    if (keys.length) {
        keys.forEach(tariffKey => {
            const tariffId = data[tariffKey].tariffId || uuid.v4();
            if (data[tariffKey].tariffId) {
                tariffData[tariffId] = data[tariffKey];
            } else {
                tariffData[tariffId] = {
                    tariffId: tariffId,
                    counterId: counterId,
                    createTime: Date.now() + Number(tariffKey),
                };
            }
            Object.keys(data[tariffKey]).forEach(field => {
                tariffData[tariffId] = {
                    ...tariffData[tariffId],
                    [field]: data[tariffKey][field]
                }
            });
        });
    }

    return (dispatch, getState) => {
        dispatch({
            type: TARIFF.CREATE,
            payload: {
                [counterId]: tariffData
            }
        })
    }
};
