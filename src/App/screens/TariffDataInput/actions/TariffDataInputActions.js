import { TARIFF_DATA } from "../../../constants/ActionConst";
import uuid from "uuid";
import {Database} from "react-native-firebase";

export const createTariffData = (counterId, values) => {
    return (dispatch, getState) => {
        /*
            tariffId: {
                value:
            }
         */
        const tariffsData = {};
        const { tariffs = {} } = getState();
        const { list = {} } = tariffs;
        const now = Date.now();
        Object.keys(values).forEach(tariffId => {
            const data = {...values[tariffId]};
            const tariff = list[tariffId];
            if (values[tariffId].hasOwnProperty('id')) {

            }
            let dataId;
            if (values[tariffId].hasOwnProperty('id')) {
                dataId = values[tariffId].id;
            } else {
                dataId = uuid.v4();
                data['id'] = dataId;
                data['createTime'] = now;
                // tariffData['amount'] = tariff.amount ? Number(tariff.amount) : 0;
            }

            values[tariffId]['amount'] = tariff.amount;
        });

        dispatch({
            type: TARIFF_DATA.CREATE,
            payload: {
                counterId: counterId,
                tariffData: values
            }
        })
    }
};