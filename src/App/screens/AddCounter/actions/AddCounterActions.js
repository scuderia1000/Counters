import uuid from 'uuid';
import {COUNTER, TARIFF, TARIFF_DATA} from "../../../constants/ActionConst";
import {createTariffData} from "../../../screens/TariffDataInput/actions/TariffDataInputActions";
import { query } from "../../../constants/FunctionConst";

export const createCounter = (counterData, id) => {
    return (dispatch, getState) => {
        // пока только одно условие можно передать
        const counter = query(`select * from counters where id = ${id}`, getState());
        const updatedCounter = counter.length && counter[0] || {};

        if (counter.length) {
            updatedCounter.updateTime = Date.now();
        } else {
            updatedCounter.id = id;
            updatedCounter.createTime = Date.now();
        }
        Object.keys(counterData).forEach(field => {
            updatedCounter[field] = counterData[field];
        });

        // commit();
        dispatch({
            type: COUNTER.CREATE,
            payload: {
                [id]: {
                    ...updatedCounter
                }
            }
        })
    }
};

export const createCounterTariff = (counterId, data) => {
    /*
            data: {
                5: {
                    amount: "5",
                    name: "We gd",
                    value: "56"
                },
                6: {
                    amount: "5",
                    counterId: "e353091c-64e6-492d-a0e2-0dc15e9cfa29",
                    createTime: 1549680171320,
                    id: "62226a1e-1d06-4044-ba7c-10b56008bd5f",
                    name: "Tgff",
                    value: "20"
                }
            }
         */
    const counterTariffs = {/*tariffId: {}*/};
    const tariffsData = {/*dataId: {}*/};

    const keys = Object.keys(data);
    if (keys.length) {
        keys.forEach(key => {
            const tariff = {...data[key]};
            let tariffId;
            if (tariff.hasOwnProperty('id')) {
                tariffId = data[key].id;
            } else {
                tariffId = uuid.v4();
                tariff['id'] = tariffId;
                tariff['createTime'] = Date.now() + Number(key);
                tariff['counterId'] = counterId;
            }

            const tariffData = {
                currentValue: 0,
                amount: tariff.amount ? Number(tariff.amount) : 0,
                tariffId: tariffId,
                createTime: tariff.createTime
            };
            let dataId;
            if (tariff.hasOwnProperty('dataId')) {
                dataId = tariff.dataId;
                delete tariff.dataId;
            } else {
                dataId = uuid.v4();
            }
            tariffData['id'] = dataId;
            if (tariff.hasOwnProperty('value')) {
                tariffData['currentValue'] = Number(tariff.value);
                delete tariff.value;
            }

            counterTariffs[tariffId] = {...tariff};
            tariffsData[dataId] = {...tariffData};
        });
    }
    /*const tariff = {};
    const tariffData = {
        /!*
        tariffId: {
            dataId: '',
            value: value,
        }
         *!/
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
    }*/

    return (dispatch, getState) => {
        dispatch({
            type: TARIFF_DATA.CREATE,
            payload: {
                // counterId: counterId,
                tariffsData: tariffsData
            }
        });
        // dispatch(createTariffData(counterId, tariffsData));
        dispatch({
            type: TARIFF.CREATE,
            payload: counterTariffs
        })
    }
};
