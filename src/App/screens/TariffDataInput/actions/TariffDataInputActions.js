import { TARIFF_DATA } from "../../../constants/ActionConst";
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
        Object.keys(values).forEach(tariffId => {
            const data = {};
            const tariff = list[tariffId];

            let dataId = uuid.v4();
            data['id'] = dataId;
            data['tariffId'] = tariffId;
            data['currentValue'] = Number(values[tariffId].currentValue);
            data['amount'] = tariff.amount > 0 && Number(tariff.amount) || 0;
            data['createTime'] = now;

            tariffsData[dataId] = data;
        });

        dispatch({
            type: TARIFF_DATA.CREATE,
            payload: {
                // counterId: counterId,
                tariffsData: tariffsData
            }
        })
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