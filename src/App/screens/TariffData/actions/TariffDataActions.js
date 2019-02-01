import {COUNTER, TARIFF, COUNTERS_VALUES, TARIFF_DATA} from '../../../constants/ActionConst';

export const removeTariffData = (counterId, dataIds) => {
    return (dispatch, getState) => {
        dispatch({
            type: TARIFF_DATA.REMOVE,
            payload: {
                counterId: counterId,
                dataIds: dataIds,
            }
        });
    }
};

export const removeAllTariffsData = (counterId) => {
    return (dispatch, getState) => {
        const { tariffs = {} } = getState();
        const { list = {} } = tariffs;
        const tariffsIds = Object.keys(list[counterId]);
        dispatch({
            type: TARIFF_DATA.REMOVE_ALL_TARIFFS_DATA,
            payload: {
                counterId: counterId,
                tariffsIds: tariffsIds
            }
        });
    }
};