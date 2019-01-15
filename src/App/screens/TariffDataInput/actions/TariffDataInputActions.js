import { TARIFF_DATA } from "../../../constants/ActionConst";

export const createTariffData = (tariffData) => {
    return (dispatch, getState) => {
        dispatch({
            type: TARIFF_DATA.CREATE,
            payload: tariffData
        })
    }
};