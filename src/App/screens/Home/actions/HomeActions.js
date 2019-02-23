import {COUNTER, TARIFF, COUNTERS_VALUES} from '../../../constants/ActionConst';
import {calculateCounterValues, cloneObject} from "../../../constants/FunctionConst";

export const editCounter = (counterId) => {
    return (dispatch, getState) => {
        const { tariffs, tariffsData } = getState();

        const counterTariffs = {};
        Object.values(tariffs.list)
            .filter(tariff => tariff.counterId === counterId)
            .map(tariff => {
                counterTariffs[tariff.id] = {
                    name: tariff.name,
                    amount: tariff.amount && String(tariff.amount) || '',
                };
                const tariffDataList = Object.values(tariffsData.list)
                    .filter(data => data.tariffId === tariff.id)
                    .sort((dataA, dataB) => dataA.createTime - dataB.createTime);
                counterTariffs[tariff.id]['currentValue'] =
                    tariffDataList[0].currentValue && String(tariffDataList[0].currentValue) || '';
            });
        // const counterTariffsIds = Object.keys(counterTariffs);
        // const counterTariffsData = {};
        // Object.values(tariffsData.list)
        //     .filter(data => counterTariffsIds.includes(data.tariffId))
        //     // .sort((dataA, dataB) => tariffsData.list[])
        //     .map(data => {
        //         if (counterTariffsData[data.tariffId]) {
        //             counterTariffsData[data.tariffId] = [...counterTariffsData[data.tariffId], data];
        //         } else {
        //             counterTariffsData[data.tariffId] = [data];
        //         }
        //     });
        // Object.values(counterTariffsData).sort((dataA, dataB) => dataA.createTime - dataB.createTime);

        dispatch({
            type: COUNTER.EDIT,
            payload: {
                counterId: counterId,
                tariffs: counterTariffs,
                // tariffsData: counterTariffsData
            }
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
            type: TARIFF.REMOVE_ALL_COUNTER_TARIFFS,
            payload: counterId
        })
    }
};

/*
export const calculateCounterData = (counterId) => {
    if (counterId) {
        return (dispatch, getState) => {
            const state = getState();
            const {counters = {}, tariffs = {}, tariffsData: tariffsValues = {}} = state;
            const counterData = counters.list[counterId];

            const counterTariffs = cloneObject(tariffs.list[counterId]);
            const tariffsIds = Object.keys(counterTariffs);

            const tariffsData = {};
            tariffsIds.forEach(id => {
                if (tariffsValues.list[id]) {
                    tariffsData[id] = cloneObject(tariffsValues.list[id]);
                }
            });

            if (Object.keys(tariffsData).length !== 0) {
                const counterValues = calculateCounterValues(counterData, counterTariffs, tariffsData);
                if (counterValues.length) {
                    // this.props.navigation.navigate('TariffData', {title: counterData.counterName});
                }
            }
            dispatch({type: COUNTERS_VALUES.UPDATE, payload: state});
        }
    }
};*/
