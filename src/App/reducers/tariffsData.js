import { TARIFF_DATA } from "../constants/ActionConst";
import { cloneObject } from "../constants/FunctionConst";


const initialState = {
    /*
    list: {
        tariffId: {
            dataId: {
                dataId: '',
                tariffId: '',
                createTime: '',
                value: '',
            },
            dataId: {
                dataId: '',
                tariffId: '',
                createTime: '',
                value: '',
            }
        }
    }
     */
};

export default (state = initialState, action) => {
    switch (action.type) {
        case TARIFF_DATA.CREATE: {
            const tariffIds = Object.keys(action.payload);
            const dataList = cloneObject(state.list);

            if (!tariffIds.length) return state;

            const oldTariffIds = Object.keys(dataList);
            tariffIds.forEach(id => {
                if (oldTariffIds.includes(id)) {

                }
            });
            // counterData.id = id;
            // counterData.createTime = Date.now();


            return {
                ...state,
                ...action.payload
            }
        }
        default: return state;
    }
}