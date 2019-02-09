import uuid from 'uuid';
import {COUNTER, TARIFF, TARIFF_DATA} from "../../../constants/ActionConst";
import {createTariffData} from "../../../screens/TariffDataInput/actions/TariffDataInputActions";
import { query } from "../../../constants/FunctionConst";

export const createCounter = (counterData, id) => {




    counterData.id = id;
    counterData.createTime = Date.now();

    return (dispatch, getState) => {
        // пока только одно условие можно передать
        const counter = query(`select * from counters where id = ${id}`, getState()) || {};

        if (counter) {
            counter.updateTime = Date.now();
        } else {
            counter.id = id;
            counter.createTime = Date.now();
        }
        Object.keys(counterData).forEach(field => {
            counter[field] = counterData[field];
        });

        // commit();
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
        dispatch(createTariffData(counterId, tariffData));
        dispatch({
            type: TARIFF.CREATE,
            payload: {
                [counterId]: tariff
            }
        })
    }
};
