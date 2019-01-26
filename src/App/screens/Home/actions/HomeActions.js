import {COUNTER, TARIFF, COUNTERS_VALUES} from '../../../constants/ActionConst';
import {calculateCounterValues, cloneObject} from "../../../constants/FunctionConst";

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
