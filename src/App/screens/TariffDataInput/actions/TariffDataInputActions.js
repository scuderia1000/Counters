import { TARIFF_DATA } from "../../../constants/ActionConst";

export const createTariffData = (counterId, tariffData) => {
    return (dispatch, getState) => {
        dispatch({
            type: TARIFF_DATA.CREATE,
            payload: {
                counterId: counterId,
                tariffData: tariffData
            }
        })
    }
};