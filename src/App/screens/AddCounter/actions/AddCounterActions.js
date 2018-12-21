import uuid from 'uuid';
import {COUNTER, TARIFF, TARIFF_DATA} from "../../../constants/ActionConst";

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
    const tariff = {};
    const tariffData = {
        /*
        tariffId: {
            dataId: '',
            value: value,
        }
         */
    };
    const valuesKeys = Object.keys(data);
    if (valuesKeys.length) {
        valuesKeys.forEach(index => {
            const tariffId = data[index].id || uuid.v4();
            if (data[index].id) {
                tariff[tariffId] = data[index];
            } else {
                tariff[tariffId] = {
                    id: tariffId,
                    counterId: counterId,
                    createTime: Date.now() + Number(index),
                };
            }
            Object.keys(data[index]).forEach(fieldName => {
                // начальные значения тарифа убираем в данные тарифа
                if (fieldName === 'value' || fieldName === 'dataId') {
                    tariffData[tariffId] = {
                        [fieldName]: data[index][fieldName],
                    };
                } else {
                    tariff[tariffId] = {
                        ...tariff[tariffId],
                        [fieldName]: data[index][fieldName]
                    }
                }
            });
        });
    }

    createTariffData(tariffData);

    return (dispatch, getState) => {
        dispatch({
            type: TARIFF.CREATE,
            payload: {
                [counterId]: tariff
            }
        })
    }
};

export const createTariffData = (tariffData) => {
    return (dispatch, getState) => {
        dispatch({
            type: TARIFF_DATA.CREATE,
            payload: tariffData
        })
    }
};
