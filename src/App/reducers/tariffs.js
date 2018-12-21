import {TARIFF} from "../constants/ActionConst";
import {cloneObject} from "../constants/FunctionConst";

const initialState = {
    list: {
        '1': {
            'tariffId_1': {
                id: 'tariffId_1',
                counterId: '1',
                createTime: new Date().getTime(),
                name: 'Холодная вода',
                amount: '30.23', // ставка тарифа
                value: '15', // значение с которого начинать расчет
            },
            'tariffId_2': {
                id: 'tariffId_2',
                counterId: '1',
                createTime: new Date().getTime(),
                name: 'Горячая вода',
                amount: '130.03', // ставка тарифа
                value: '0', // значение с которого начинать расчет
            }
        }
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case TARIFF.CREATE: {
            return {
                ...state,
                list: {
                    ...action.payload
                }
            }
        }
        case TARIFF.REMOVE: {
            const counterId = action.payload;
            const tariffsList = state.list && cloneObject(state.list) || {};
            delete tariffsList[counterId];
            return {
                ...state,
                list: tariffsList
            }
        }
        default: return state;
    }
}