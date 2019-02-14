import uuid from 'uuid';
import {COUNTER, TARIFF, TARIFF_DATA} from "../../../constants/ActionConst";
import {createTariffData} from "../../../screens/TariffDataInput/actions/TariffDataInputActions";
import { query } from "../../../constants/FunctionConst";

export const createCounter = (counterData, id) => {
    const counter = {
        ...counterData,
        id: id,
        createTime: Date.now(),
    };
    return (dispatch, getState) => {
        dispatch({
            type: COUNTER.CREATE,
            payload: {
                [id]: {
                    ...counter
                }
            }
        })
    }
};

export const updateCounter = (counterData, id) => {
    return (dispatch, getState) => {
        // пока только одно условие можно передать
        const { counters } = getState();
        const { list } = counters;

        const updatedCounter = {
            ...list[id],
            ...counterData
        };

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

    const now = Date.now();
    Object.values(data).forEach(tariffItem => {
        const tariff = {
            id: uuid.v4(),
            counterId: counterId,
            name: tariffItem.name,
            amount: tariffItem.amount > 0 && Number(tariffItem.amount) || null,
            createTime: now,
        };
        const data = {
            id: uuid.v4(),
            tariffId: tariff.id,
            currentValue: tariffItem.currentValue > 0 && Number(tariffItem.currentValue) || null,
            amount: tariff.amount,
            createTime: now,
        };
        counterTariffs[tariff.id] = {...tariff};
        tariffsData[data.id] = {...data};
    });

    return (dispatch, getState) => {
        dispatch({
            type: TARIFF.CREATE,
            payload: counterTariffs
        });

        dispatch({
            type: TARIFF_DATA.CREATE,
            payload: {
                // counterId: counterId,
                tariffsData: tariffsData
            }
        });

    }
};

export const updateCounterTariff = (counterId, data) => {
    return (dispatch, getState) => {

        const counterTariffs = {/*tariffId: {}*/};
        const tariffsData = {/*dataId: {}*/};

        Object.values(data).forEach(item => {
            const { tariffs, tariffsData } = getState();
            const tariff = {
                ...tariffs.list[item.id],
                name: item.name,
                amount: item.amount > 0 && Number(item.amount) || null,
            };
            const data = {
                ...tariffsData.list[item.dataId],
                currentValue: item.currentValue > 0 && Number(item.currentValue) || null,
                // если изменилась ставка тарифа, то начальные данные не персчитываем
                // изменения ставки тарифа касаются только новых данных
                // amount: tariff.amount,
            };
            counterTariffs[tariff.id] = {...tariff};
            tariffsData[data.id] = {...data};
        });

        dispatch({
            type: TARIFF.UPDATE,
            payload: counterTariffs
        });

        dispatch({
            type: TARIFF_DATA.UPDATE,
            payload: {
                tariffsData: tariffsData
            }
        });

    }
};
