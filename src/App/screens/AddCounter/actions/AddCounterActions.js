import uuid from 'uuid';
import {COUNTER, TARIFF, TARIFF_DATA} from "../../../constants/ActionConst";
import {createTariffData} from "../../../screens/TariffDataInput/actions/TariffDataInputActions";

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
    const valuesIndex = Object.keys(data);
    if (valuesIndex.length) {
        valuesIndex.forEach(index => {
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
                const tariffKeys = Object.keys(tariff[tariffId]);
                // начальные значения тарифа убираем в данные тарифа
                if (fieldName === 'value' || fieldName === 'dataId') {
                    tariffData[tariffId] = {
                        ...tariffData[tariffId],
                        [fieldName]: data[index][fieldName],
                    };
                    if (tariffKeys.includes(fieldName)) delete tariff[tariffId][fieldName];
                } else {
                    if (fieldName === 'tariffId' && tariffKeys.includes(fieldName)) {
                        delete tariff[tariffId][fieldName];
                    } else {
                        tariff[tariffId] = {
                            ...tariff[tariffId],
                            [fieldName]: data[index][fieldName]
                        }
                    }
                }
            });
        });
    }

    return (dispatch, getState) => {
        dispatch(createTariffData(tariffData));
        dispatch({
            type: TARIFF.CREATE,
            payload: {
                [counterId]: tariff
            }
        })
    }
};
