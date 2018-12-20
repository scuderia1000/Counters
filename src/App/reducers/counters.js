import { COUNTER } from "../constants/ActionConst";
import { cloneObject } from "../constants/FunctionConst";

const initState = {
    list: {
        '1': {
            id: 1,
            createTime: new Date().getTime(),
            counterName: 'Test 1',
            tariffName: 'Tariff 1',
            tariff: 15,
            personalAccount: '1234567890',
            fio: 'Иванов Иван иванович',
            address: 'Harvard 12-89',
            emailAddress: 'test@test.test',
        }
    }
};

export default (state = initState, action) => {
    switch (action.type) {
        case COUNTER.CREATE: {
            const oldCounters = state.list && cloneObject(state.list) || {};
            const newCounters = {...oldCounters, ...action.payload};
            const sortedCounters = {};
            const keys = Object.keys(newCounters);
            keys.sort((key1, key2) => newCounters[key1].createTime - newCounters[key2].createTime)
                .forEach(key => sortedCounters[key] = newCounters[key]);

            return {
                ...state,
                list: {
                    ...sortedCounters
                }
            }
        }
        case COUNTER.EDIT: {
            return {
                ...state,
                counterId: action.payload
            }
        }
        case COUNTER.REMOVE: {
            const counterId = action.payload;
            const countersList = state.list && cloneObject(state.list) || {};
            delete countersList[counterId];

            return {
                ...state,
                list: countersList
            }
        }
        default: return state;
    }
}