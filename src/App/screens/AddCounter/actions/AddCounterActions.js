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
        let tariffName = getTariffName(tariffItem);
        let tariffAmount = getTariffAmount(tariffItem);
        const tariff = {
            id: uuid.v4(),
            counterId: counterId,
            name: tariffName,
            amount: tariffAmount > 0 && Number(tariffAmount) || null,
            createTime: now,
        };

        let tariffCurrentValue = getTariffCurrentValue(tariffItem);
        const data = {
            id: uuid.v4(),
            tariffId: tariff.id,
            currentValue: tariffCurrentValue > 0 && Number(tariffCurrentValue) || null,
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

export const updateCounterTariff = (counterId, tariffsValues) => {
    return (dispatch, getState) => {

        const { editData = {} } = getState().counters;

        const counterTariffs = {/*tariffId: {}*/};
        const counterTariffsData = {/*dataId: {}*/};
        const newTariff = {/*tariffId: {}*/};

        Object.values(tariffsValues).forEach((item, index) => {
            if (item.id) {
                const {tariffs, tariffsData} = getState();
                let tariffName = getTariffName(item);
                let tariffAmount = getTariffAmount(item);
                const tariff = {
                    ...tariffs.list[item.id],
                    name: tariffName,
                    amount: tariffAmount > 0 && Number(tariffAmount) || null,
                };

                let tariffCurrentValue = getTariffCurrentValue(item);
                const tariffDataList = Object.values(tariffsData.list)
                    .filter(data => data.tariffId === item.id)
                    .sort((dataA, dataB) => dataA.createTime - dataB.createTime);
                const dataId = tariffDataList[0].id;

                const data = {
                    currentValue: tariffCurrentValue > 0 && Number(tariffCurrentValue) || null,
                    // если изменилась ставка тарифа, то начальные данные не персчитываем
                    // изменения ставки тарифа касаются только новых данных
                    // amount: tariff.amount,
                };
                counterTariffs[tariff.id] = {...tariff};
                counterTariffsData[dataId] = {...data};
            } else {
                newTariff[index] = {...item}
            }
        });

        if (Object.keys(newTariff).length) {
            dispatch(createCounterTariff(counterId, newTariff));
        }

        dispatch({
            type: TARIFF.UPDATE,
            payload: counterTariffs
        });

        dispatch({
            type: TARIFF_DATA.UPDATE,
            payload: {
                tariffsData: counterTariffsData
            }
        });

    }
};

const getTariffName = (tariffItem) => {
    let tariffName = '';
    Object.keys(tariffItem).filter(field => field.includes('tariffName'))
        .map(field => tariffName = tariffItem[field]);
    return tariffName;
};

const getTariffAmount = (tariffItem) => {
    let tariffAmount = null;
    Object.keys(tariffItem).filter(field => field.includes('tariffAmount'))
        .map(field => tariffAmount = tariffItem[field]);
    return tariffAmount;
};

const getTariffCurrentValue = (tariffItem) => {
    let tariffCurrentValue = null;
    Object.keys(tariffItem).filter(field => field.includes('tariffCurrentValue'))
        .map(field => tariffCurrentValue = tariffItem[field]);
    return tariffCurrentValue;
};