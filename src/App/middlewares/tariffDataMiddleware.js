import {COUNTER, COUNTERS_VALUES, TARIFF, TARIFF_DATA} from "../constants/ActionConst";
import {calculateCounterValues, getCounterTariffsData} from "../constants/FunctionConst";

export const tariffDataMiddleware = store => next => action => {
    switch (action.type) {
        // пересчет значений, если данные поменялись
        /*case TARIFF_DATA.REMOVE_ALL_COUNTER_TARIFFS:
        case TARIFF_DATA.REMOVE_ALL_TARIFFS_DATA:
        case TARIFF_DATA.CREATE: {
            const { counterId } = action.payload;
            const result = next(action);

            updateCounterValues(store, counterId);

            return result;
        }*/
        default: next(action);
    }
};

const updateCounterValues = (store, counterId) => {
    // обновленный state
    const state = store.getState();
    const { tariffs = {}, tariffsData = {} } = state;
    const counterValues = calculate(counterId, tariffs, tariffsData);

    if (counterValues.length) {
        store.dispatch({
            type: COUNTERS_VALUES.UPDATE,
            payload: {
                counterId: counterId,
                counterData: counterValues
            }
        });
    }
};

const calculate = (counterId, tariffs, tariffsValues) => {
    const tariffsData = getCounterTariffsData(counterId, tariffs, tariffsValues);
    let counterValues = [];
    if (Object.keys(tariffsData).length !== 0) {
        counterValues = calculateCounterValues(counterId, tariffs, tariffsData);
    }
    return counterValues;
};