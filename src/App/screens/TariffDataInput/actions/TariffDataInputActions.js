import { COUNTER, TARIFF_DATA } from '../../../constants/ActionConst';
import uuid from "uuid";
// import {Database} from "react-native-firebase";

export const createTariffData = (values) => {
    return (dispatch, getState) => {
        /*
            tariffId: {
                currentValue:
            }
         */
        const tariffsData = {};
        const { tariffs = {} } = getState();
        const { list = {} } = tariffs;
        const now = Date.now();
        let counterId = '';
        Object.keys(values).forEach(tariffId => {
            const tariff = list[tariffId];

            if (!counterId) counterId = tariff.counterId;

            let dataId = uuid.v4();

            tariffsData[dataId] = {
                id: dataId,
                tariffId: tariffId,
                currentValue: Number(values[tariffId].currentValue),
                amount: tariff.amount > 0 && Number(tariff.amount) || 0,
                createTime: now,
            };
        });

        dispatch({
            type: TARIFF_DATA.CREATE,
            payload: {
                // counterId: counterId,
                tariffsData: tariffsData
            }
        });
        dispatch({
            type: COUNTER.ADD_DATA,
            payload: {
                counterId: counterId,
                dataIds: Object.keys(tariffsData)
            }
        });
    }
};

export const updateTariffData = (values) => {
    return (dispatch, getState) => {
        /*
            tariffId: {
                id:
                currentValue:
            }
         */
        const updatedData =  {};
        Object.keys(values).map(tariffId => {
            const data = values[tariffId];
            updatedData[data.id] = {currentValue: Number(data.currentValue)}
        });

        dispatch({
            type: TARIFF_DATA.UPDATE,
            payload: {
                // counterId: counterId,
                tariffsData: updatedData
            }
        })
    }
};