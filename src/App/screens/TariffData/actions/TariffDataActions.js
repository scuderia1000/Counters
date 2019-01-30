import {COUNTER, TARIFF, COUNTERS_VALUES, TARIFF_DATA} from '../../../constants/ActionConst';
import {calculateCounterValues, getCounterTariffsData} from "../../../constants/FunctionConst";

export const removeTariffData = (counterId, dataIds) => {
    return (dispatch, getState) => {
        dispatch({
            type: TARIFF_DATA.REMOVE,
            payload: {
                dataIds: dataIds,
            }
        });
        const { tariffsData = {}, tariffs = {} } = getState();
        const tariffsValues = getCounterTariffsData(counterId, tariffs, tariffsData);
        if (Object.keys(tariffsValues).length !== 0) {
            const counterValues = calculateCounterValues(counterId, tariffs, tariffsValues);
            if (counterValues.length) {
                dispatch({
                    type: COUNTERS_VALUES.UPDATE,
                    payload: {
                        counterId: counterId,
                        counterData: counterValues
                    }
                });
            }
        }
    }
};