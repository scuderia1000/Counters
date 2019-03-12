import { COUNTER } from "../constants/ActionConst";
import { cloneObject } from "../constants/FunctionConst";

const initState = {
    // list: {
    //     '1': {
    //         id: '1',
    //         createTime: new Date().getTime(),
    //         counterName: 'Счетчик воды',
    //         personalAccount: '1234567890',
    //         fio: 'Иванов Иван иванович',
    //         address: 'Harvard 12-89',
    //         emailAddress: 'test@test.test',
    //     }
    // }
};

export default (state = initState, action) => {
    switch (action.type) {
        case COUNTER.CREATE: {
            const oldCounters = cloneObject(state.list);
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
                editData: {
                    ...action.payload

                }
            }
        }
        case COUNTER.RESET_COUNTER_EDIT_DATA: {
            return {
                ...state,
                editData: {}
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
        case COUNTER.ADD_DATA: {
            const { counterId = '', dataIds = [] }= action.payload;
            const { list = {} }= state;
            const oldDataIds = list[counterId].dataIds || [];
            // console.log('oldDataIds', oldDataIds)
            // delete countersList[counterId];

            return {
                ...state,
                list: {
                    ...state.list,
                    [counterId]: {
                        ...state.list[counterId],
                        dataIds: oldDataIds.concat(dataIds),
                    }
                }
            }
        }
        case COUNTER.REMOVE_DATA: {
            const { counterId = '', dataIds = [] }= action.payload;
            const { list = {} } = state;
            const oldDataIds = list[counterId].dataIds.slice();
            dataIds.forEach(id => oldDataIds.splice(oldDataIds.indexOf(id), 1));

            return {
                ...state,
                list: {
                    ...state.list,
                    [counterId]: {
                        ...state.list[counterId],
                        dataIds: oldDataIds,
                    }
                }
            }
        }
        default: return state;
    }
}